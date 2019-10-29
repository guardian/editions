import { Handler } from 'aws-lambda'
import { unnest } from 'ramda'
import { attempt, hasFailed } from '../../../../backend/utils/try'
import { Image, ImageSize, imageSizes } from '../../../common'
import {
    getAndUploadColours,
    getAndUploadImage,
    getImagesFromFront,
} from './helpers/media'
import pAll = require('p-all')
import { FrontTaskOutput } from '../front'
import { handleAndNotifyOnError } from '../../services/task-handler'
import { getFront } from '../../utils/backend-client'

type ImageTaskInput = FrontTaskOutput
export interface ImageTaskOutput extends Omit<FrontTaskOutput, 'images'> {
    failedImages: number
    failedColours: number
}
export const handler: Handler<
    ImageTaskInput,
    ImageTaskOutput
> = handleAndNotifyOnError(
    async ({ issuePublication, issue, frontId, ...params }) => {
        const { publishedId } = issue

        const maybeFront = await getFront(publishedId, frontId)

        if (hasFailed(maybeFront)) {
            console.error(JSON.stringify(attempt))
            throw new Error(`Could not download front ${frontId}`)
        }

        console.log(`succesfully download front ${frontId}`, maybeFront)


        const frontUpload = await attempt(
            upload(
                frontPath(publishedId, frontId),
                maybeFront,
                'application/json',
                ONE_WEEK,
            ),
        )
    
        if (hasFailed(frontUpload)) {
            console.error(JSON.stringify(frontUpload))
            throw new Error('Could not upload front')
        }
        const publishedFronts = [...issue.fronts, frontId]
    
        console.log(`front uploaded`, publishedFronts)






        const images: Image[] = unnest(getImagesFromFront(maybeFront))

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
        failedImageUploads.map(failure =>
            console.error(JSON.stringify(failure)),
        )

        console.log('Uploaded images')

        const failedImages = failedImageUploads.length
        const failedColours = failedColourUploads.length
        const success = failedImages + failedColours === 0

        return {
            issuePublication,
            issue,
            frontId,
            ...params,
            failedColours,
            failedImages,
            message: `Images and colours fetched and uploaded ${
                success ? 'succesfully' : 'with some errors'
            }.`,
        }
    },
)
