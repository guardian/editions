import { Handler } from 'aws-lambda'
import { unnest } from 'ramda'
import { attempt, hasFailed } from '../../../../backend/utils/try'
import { Image, ImageSize, imageSizes, Issue, frontPath } from '../../../common'
import { handleAndNotifyOnError } from '../../services/task-handler'
import { getFront } from '../../utils/backend-client'
import { getAndUploadImage, getImagesFromFront } from './helpers/media'
import pAll = require('p-all')
import { IssueParams } from '../issue'
import { upload, ONE_WEEK } from '../../utils/s3'

export interface FrontTaskInput extends IssueParams {
    issue: Issue
    front: string //This is filled in by the state machine's map construct
}

export const handler: Handler<
    FrontTaskInput,
    { message: string } //This is ignored by the state machine
> = handleAndNotifyOnError(async ({ issue, front }) => {
    const { publishedId } = issue

    const maybeFront = await getFront(publishedId, front)

    if (hasFailed(maybeFront)) {
        console.error(JSON.stringify(attempt))
        throw new Error(`Could not download front ${front}`)
    }

    console.log(`succesfully download front ${front}`, maybeFront)

    const frontUpload = await attempt(
        upload(
            frontPath(publishedId, front),
            maybeFront,
            'application/json',
            ONE_WEEK,
        ),
    )

    if (hasFailed(frontUpload)) {
        console.error(JSON.stringify(frontUpload))
        throw new Error('Could not upload front')
    }

    console.log(`front uploaded`, front)

    const images: Image[] = unnest(getImagesFromFront(maybeFront))

    const imagesWithSizes: [Image, ImageSize][] = unnest(
        images.map(image =>
            imageSizes.map((size): [Image, ImageSize] => [image, size]),
        ),
    )

    const imageUploadActions = imagesWithSizes.map(
        ([image, size]) => async () =>
            attempt(getAndUploadImage(publishedId, image, size)),
    )

    const imageUploads = await pAll(imageUploadActions, { concurrency: 20 })

    const failedImageUploads = imageUploads.filter(hasFailed)
    failedImageUploads.map(failure => console.error(JSON.stringify(failure)))

    console.log('Uploaded images')

    const failedImages = failedImageUploads.length
    const success = failedImages === 0

    return {
        message: `${front} and images uploaded ${
            success ? 'succesfully' : 'with some images missing'
        }.`,
    }
})
