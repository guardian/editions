import { Handler } from 'aws-lambda'
import { unnest } from 'ramda'
import { attempt, hasFailed } from '../../../../backend/utils/try'
import {
    frontPath,
    Image,
    ImageSize,
    imageSizes,
    ImageUse,
    Issue,
} from '../../../common'
import { handleAndNotifyOnError } from '../../services/task-handler'
import { getFront, getRenderedContent } from '../../utils/backend-client'
import { getBucket, ONE_WEEK, upload } from '../../utils/s3'
import { IssueParams } from '../issue'
import {
    getAndUploadImageUse,
    getImagesFromFront,
    getImageUses,
} from './helpers/media'
import pAll = require('p-all')
import { sleep } from '../../utils/sleep'
import { getHtmlFromFront, uploadRenderedArticle } from './helpers/render'

export interface FrontTaskInput extends IssueParams {
    issue: Issue
    front: string //This is filled in by the state machine's map construct
}

const Bucket = getBucket('proof')

export const handler: Handler<
    FrontTaskInput,
    { message: string } //This is ignored by the state machine
> = handleAndNotifyOnError(async ({ issue, front }) => {
    console.log(`Uploading front+images for ${front}, ${issue}`)
    await sleep(1000)

    const { publishedId } = issue

    const maybeFront = await getFront(publishedId, front)

    if (hasFailed(maybeFront)) {
        console.error(JSON.stringify(attempt))
        throw new Error(`Could not download front ${front}`)
    }

    console.log(
        `succesfully download front ${front}`,
        JSON.stringify(maybeFront),
    )

    const frontUpload = await attempt(
        upload(
            frontPath(publishedId, front),
            maybeFront,
            Bucket,
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
    type ImageSizeUse = [Image, ImageSize, ImageUse]
    const imagesWithUses: ImageSizeUse[] = unnest(
        unnest(
            images.map(image =>
                imageSizes.map(size =>
                    getImageUses(image).map(
                        (use): ImageSizeUse => [image, size, use],
                    ),
                ),
            ),
        ),
    )

    const imageUseUploadActions = imagesWithUses.map(
        ([image, size, use]) => async () =>
            attempt(getAndUploadImageUse(publishedId, image, size, use)),
    )

    const imageUseUploads = await pAll(imageUseUploadActions, {
        concurrency: 20,
    })

    const failedImageUseUploads = imageUseUploads.filter(hasFailed)
    failedImageUseUploads.map(failure => console.error(JSON.stringify(failure)))
    console.log('Uploaded images')

    const failedImages = failedImageUseUploads.length
    const success = failedImages === 0

    // server side rendering
    const renderedContent = await getHtmlFromFront(maybeFront)

    const result = renderedContent.map(content => {
        if (hasFailed(content.content)) {
            const errorMessage = `Failed to render articles for front ${front}`
            console.error(errorMessage)
            throw new Error(errorMessage)
        }
        uploadRenderedArticle(content.internalPageCode, content.content)
    })

    const failedHtmlUploads = result.filter(hasFailed)
    if (failedHtmlUploads.length > 0) {
        console.warn(
            `${failedHtmlUploads.length} rendered articles failed to upload`,
        )
    }
    console.log('Uploaded rendered HTML')
    return {
        message: `${front} and images uploaded ${
            success ? 'succesfully' : 'with some images missing'
        }.`,
    }
}, Bucket)
