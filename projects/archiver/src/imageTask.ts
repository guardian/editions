import { Handler } from 'aws-lambda'
import { unnest } from 'ramda'
import { attempt, hasFailed } from '../../backend/utils/try'
import { Image, ImageSize, imageSizes } from '../common'
import { getAndUploadColours, getAndUploadImage } from '../media'
import pAll = require('p-all')
import { FrontTaskOutput } from './frontTask'
import { logInput, logOutput } from './log-utils'

export interface MediaTaskOutput extends Omit<FrontTaskOutput, 'images'> {
    failedImages: number
    failedColours: number
}
export const handler: Handler<FrontTaskOutput, MediaTaskOutput> = async ({
    issuePublication,
    issue,
    images,
    ...params
}) => {
    logInput({
        issuePublication,
        issue,
        images,
        ...params,
    })
    const { publishedId } = issue

    const imagesWithSizes: [Image, ImageSize][] = unnest(
        images.map(image =>
            imageSizes.map((size): [Image, ImageSize] => [image, size]),
        ),
    )

    const colourUploads = await Promise.all(
        images.map(image => getAndUploadColours(publishedId, image)),
    )

    const failedColourUploads = colourUploads.filter(hasFailed)
    failedColourUploads.forEach(error => {
        console.error('Uploading colour failed.')
        console.error(JSON.stringify(error))
    })

    const imageUploadActions = imagesWithSizes.map(
        ([image, size]) => async () =>
            attempt(getAndUploadImage(publishedId, image, size)),
    )

    const imageUploads = await pAll(imageUploadActions, { concurrency: 20 })

    const failedImageUploads = imageUploads.filter(hasFailed)
    failedImageUploads.map(failure => console.error(JSON.stringify(failure)))

    console.log('Uploaded images')

    const failedImages = failedImageUploads.length
    const failedColours = failedColourUploads.length
    const success = failedImages + failedColours === 0

    const out: MediaTaskOutput = {
        issuePublication,
        issue,
        ...params,
        failedColours,
        failedImages,
        message: `Images and colours fetched and uploaded ${
            success ? 'succesfully' : 'with some errors'
        }.`,
    }
    logOutput(out)
    return out
}
