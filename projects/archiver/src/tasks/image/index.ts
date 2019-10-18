import { Handler } from 'aws-lambda'
import { unnest } from 'ramda'
import { attempt, hasFailed } from '../../../../backend/utils/try'
import { ImageUse } from '../../../../common/src'
import { Image, ImageSize, imageSizes } from '../../../common'
import { handleAndNotifyOnError } from '../../services/task-handler'
import { FrontTaskOutput } from '../front'
import {
    getAndUploadImage,
    getAndUploadImageUse,
    getImageUses,
} from './helpers/media'
import pAll = require('p-all')

type ImageTaskInput = FrontTaskOutput
export interface ImageTaskOutput extends Omit<FrontTaskOutput, 'images'> {
    failedImages: number
}
export const handler: Handler<
    ImageTaskInput,
    ImageTaskOutput
> = handleAndNotifyOnError(
    async ({ issuePublication, issue, images, ...params }) => {
        const { publishedId } = issue
        //delete me

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
        failedImageUploads.map(failure =>
            console.error(JSON.stringify(failure)),
        )

        //to here

        const imagesWithUses: [Image, ImageSize, ImageUse][] = unnest(
            unnest(
                images.map(image =>
                    imageSizes.map(size =>
                        getImageUses(image).map((use): [
                            Image,
                            ImageSize,
                            ImageUse,
                        ] => [image, size, use]),
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
        failedImageUploads.map(failure =>
            console.error(JSON.stringify(failure)),
        )
        console.log('Uploaded images')

        const failedImages =
            failedImageUploads.length + failedImageUseUploads.length

        const success = failedImages === 0

        return {
            issuePublication,
            issue,
            ...params,
            failedImages,
            message: `Images fetched and uploaded ${
                success ? 'succesfully' : 'with some errors'
            }.`,
        }
    },
)
