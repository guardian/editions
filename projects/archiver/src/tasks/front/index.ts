import { Handler } from 'aws-lambda'
import { unnest } from 'ramda'
import { attempt, hasFailed } from '../../../../backend/utils/try'
import { frontPath, Image } from '../../../common'
import { getImagesFromFront } from '../image/helpers/media'
import { getFront } from '../../utils/backend-client'
import { IssueTaskOutput } from '../issue'
import { Bucket, upload, ONE_WEEK } from '../../utils/s3'
import { handleAndNotifyOnError } from '../../services/task-handler'

type FrontTaskInput = IssueTaskOutput
export interface FrontTaskOutput extends IssueTaskOutput {
    images: Image[]
}
export const handler: Handler<
    FrontTaskInput,
    FrontTaskOutput
> = handleAndNotifyOnError(async ({ issuePublication, issue, fronts }) => {
    const { publishedId } = issue
    console.log(`Attempting to upload ${publishedId} to ${Bucket}`)
    const [frontId, ...remainingFronts] = fronts

    const maybeFront = await getFront(publishedId, frontId)

    if (hasFailed(maybeFront)) {
        console.error(JSON.stringify(attempt))
        throw new Error(`Could not download front ${frontId}`)
    }

    console.log(`succesfully download front ${frontId}`, maybeFront)

    const images: Image[] = unnest(getImagesFromFront(maybeFront))

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

    return {
        issuePublication,
        issue: { ...issue, fronts: publishedFronts },
        images,
        fronts: remainingFronts,
        remainingFronts: remainingFronts.length,
        message: `Succesfully published ${frontId}`,
    }
})
