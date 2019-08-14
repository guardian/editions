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
import { generateIndex, summary } from './src/indexer/summary'
import pAll from 'p-all'
interface Record {
    s3: { bucket: { name: string }; object: { key: string } }
} //partial of https://docs.aws.amazon.com/AmazonS3/latest/dev/notification-content-structure.html

const fetch = async (source: string, id: string): Promise<void> => {
    console.log(`Attempting to upload ${id} to ${bucket}`)
    const path = `${source}/${id}`
    const issue = await attempt(getIssue(path))
    if (hasFailed(issue)) {
        console.log(JSON.stringify(issue))
        throw new Error('Failed to download issue.')
    }
    console.log('Downloaded issue', path)

    const maybeFronts = await Promise.all(
        issue.fronts.map(
            async (frontid): Promise<Attempt<[string, Front]>> =>
                await getFront(path, frontid),
        ),
    )

    maybeFronts.forEach(attempt => {
        if (hasFailed(attempt)) {
            console.warn(`Front failed with ${attempt.error}`)
        }
    })

    const fronts = maybeFronts.filter(hasSucceeded)

    console.log(`Fetched fronts ${JSON.stringify(fronts.map(_ => _[0]))}`)

    const frontUploads = await Promise.all(
        fronts.map(async ([frontId, maybeFront]) => {
            return attempt(upload(frontPath(id, frontId), maybeFront))
        }),
    )

    const images = unnest(fronts.map(([, front]) => getImagesFromFront(front)))
    const imagesWithSizes: [Image, ImageSize][] = unnest(
        images.map(image =>
            imageSizes.map((size): [Image, ImageSize] => [image, size]),
        ),
    )

    const colourUploads = await Promise.all(
        images.map(image => getAndUploadColours(source, id, image)),
    )

    colourUploads.filter(hasFailed).forEach(error => {
        console.error('Uploading colour failed.')
        console.error(error)
    })

    const imageUploadActions = imagesWithSizes.map(
        ([image, size]) => async () =>
            attempt(getAndUploadImage(source, id, image, size)),
    )

    const imageUploads = await pAll(imageUploadActions, { concurrency: 20 })

    imageUploads
        .filter(hasFailed)
        .map(failure => console.error(JSON.stringify(failure)))

    console.log('Uploaded images')

    frontUploads
        .filter(hasFailed)
        .forEach(failure => console.error(JSON.stringify(failure)))

    console.log('Uploaded fronts')

    await upload(issuePath(id), issue)
    console.log('Uploaded issue.')
}

const compress = async (id: string) => {
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

export const run = async (source: string, id: string): Promise<void> => {
    await fetch(source, id)
    await summary()
    await compress(id)
}

const s3Event = async (records: Record[]) => {
    const keys = records.map(record => decodeURIComponent(record.s3.object.key))
    const key = keys[0]
    keys.slice(1).map(key => `Unexpected additional key ${key} not processed`)
    //TODO: feed these failures to the publication
    const [, id, filename] = key.split('/')
    if (filename === undefined || id === undefined) {
        throw new Error(`${key} does not correspond to an issue`)
    }
    const source = filename.replace('.json', '')
    const result = await run(source, id)
    if (keys.length > 1) {
        throw new Error('Too many keys 🔑🗝🎹')
        //Throw so the lambda fails, but at least try to publish one of them
    }
    return result
}

//When run in AWS
export const handler: Handler<
    {
        id?: string
        source?: string
        index?: boolean
        Records: Record[]
    },
    void
> = async event => {
    try {
        if (event.index) return summary()
        if (event.Records) return s3Event(event.Records)
        const id = event.id
        if (!(id && typeof id === 'string')) throw new Error('No ID in event')
        const source = event.source
        if (!(source && typeof source === 'string'))
            throw new Error('No source in event')

        return run(source, id)
    } catch (e) {
        console.error(e)
        console.log('Archiver lambda called with:')
        console.log(JSON.stringify(event))
    }
}
