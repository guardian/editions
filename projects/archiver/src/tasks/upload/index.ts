import { Handler } from 'aws-lambda'
import { attempt, hasFailed } from '../../../../backend/utils/try'
import { issuePath } from '../../../common'
import { ImageTaskOutput } from '../image'
import { IssueTaskOutput } from '../issue'
import { upload, ONE_WEEK } from '../../utils/s3'
import { putStatus } from '../../services/status'
import { handleAndNotify } from '../../services/task-handler'

type UploadTaskInput = ImageTaskOutput
export type UploadTaskOutput = Pick<
    IssueTaskOutput,
    'issuePublication' | 'message' | 'issue'
>
export const handler: Handler<
    UploadTaskInput,
    UploadTaskOutput
> = handleAndNotify('assembled', async ({ issuePublication, issue }) => {
    const { publishedId } = issue
    const issueUpload = await attempt(
        upload(issuePath(publishedId), issue, 'application/json', ONE_WEEK),
    )
    if (hasFailed(issueUpload)) {
        console.error(JSON.stringify(issueUpload))
        throw new Error('Failed to upload issue file')
    }
    await putStatus(issuePublication, 'assembled')
    return {
        issuePublication,
        message: 'Issue uploaded succesfully',
        issue,
    }
})
