require('dotenv').config()

import { Handler } from 'aws-lambda'
import { getIssue, getFront } from './downloader'
import { attempt, hasFailed, hasSucceeded, Attempt } from '../backend/utils/try'
import { Front, issuePath, frontPath } from './common'
import { upload } from './upload'
import { zip } from './zipper'
import {
    getImagesFromFront,
    getAndUploadColours,
    getAndUploadImage,
} from './media'
import { unnest } from 'ramda'
import { imageSizes, issueDir, ImageSize, Image } from '../common/src/index'
import { bucket } from './s3'

export const run = async (id: string): Promise<void> => {
    console.log(`Attempting to upload ${id} to ${bucket}`)
    const issue = await attempt(getIssue(id))
    if (hasFailed(issue)) {
        console.log(JSON.stringify(issue))
        throw new Error('Failed to download issue.')
    }
    console.log('Downloaded issue', id)

    const maybeFronts = await Promise.all(
        issue.fronts.map(
            async (frontid): Promise<Attempt<[string, Front]>> =>
                await getFront(id, frontid),
        ),
    )

    maybeFronts.forEach(attempt => {
        if (hasFailed(attempt)) {
            console.warn(`Front ${id} failed with ${attempt.error}`)
        }
    })

    const fronts = maybeFronts.filter(hasSucceeded)

    console.log(`Fetched fronts ${JSON.stringify(fronts.map(_ => _[0]))}`)

    const frontUploads = await Promise.all(
        fronts.map(async ([frontId, maybeFront]) => {
            return attempt(upload(frontPath(id, frontId), maybeFront))
        }),
    )

    frontUploads
        .filter(hasFailed)
        .forEach(failure => console.error(JSON.stringify(failure)))

    console.log('Uploaded fronts')
    const images = unnest(fronts.map(([, front]) => getImagesFromFront(front)))
    const imagesWithSizes: [Image, ImageSize][] = unnest(
        images.map(image =>
            imageSizes.map((size): [Image, ImageSize] => [image, size]),
        ),
    )

    const colourUploads = await Promise.all(
        images.map(image => getAndUploadColours(id, image)),
    )

    colourUploads.filter(hasFailed).forEach(error => {
        console.error('Uploading colour failed.')
        console.error(error)
    })

    let imageUploads = await Promise.all(
        imagesWithSizes.map(async ([image, size]) =>
            attempt(getAndUploadImage(id, image, size)),
        ),
    )

    imageUploads
        .filter(hasFailed)
        .map(failure => console.error(JSON.stringify(failure)))

    console.log('Uploaded images')

    await upload(issuePath(id), issue)
    console.log('Uploaded issue.')

    console.log('Compressing')
    await zip(id, issueDir(id), 'media')

    console.log('data zip uploaded')
    await Promise.all(
        imageSizes.map(async size => {
            await zip(`${id}-${size}`, `${issueDir(id)}/media/${size}/`)
            console.log(` ${size} media zip uploaded`)
        }),
    )
    console.log('Media zips uploaded.')
}

//When run in AWS
export const handler: Handler<{ id?: string }, void> = async event => {
    const id = event.id
    if (!(id && typeof id === 'string')) throw new Error('Nope')
    return run(id)
}
