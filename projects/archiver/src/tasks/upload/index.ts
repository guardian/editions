import { Handler } from 'aws-lambda'
import { attempt, hasFailed } from '../../../../backend/utils/try'
import { issuePath } from '../../../common'
import { handleAndNotify } from '../../services/task-handler'
import { ONE_WEEK, upload } from '../../utils/s3'
import { IssueTaskOutput } from '../issue'

type UploadTaskInput = IssueTaskOutput
export type UploadTaskOutput = Pick<
    IssueTaskOutput,
    'issuePublication' | 'message' | 'issue'
>
export const handler: Handler<
    UploadTaskInput,
    UploadTaskOutput
> = handleAndNotify('assembled', async ({ issuePublication, issue }) => {
    const { publishedId } = issue
    const path = issuePath(publishedId)
    const issueUpload = await attempt(
        upload(path, issue, 'application/json', ONE_WEEK),
    )
    if (hasFailed(issueUpload)) {
        console.error(JSON.stringify(issueUpload))
        throw new Error('Failed to upload issue file')
    }

    console.log(`Issue file upload to ${path} succeeded`, issue)

    return {
        issuePublication,
        message: 'Issue uploaded succesfully',
        issue,
    }
})
