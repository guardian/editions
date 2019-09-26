import { Handler } from 'aws-lambda'
import { attempt, hasFailed } from '../../backend/utils/try'
import { issuePath } from '../common'
import { MediaTaskOutput } from './imageTask'
import { IssueTaskOutput } from './issueTask'
import { upload, ONE_WEEK } from './upload'
import { putStatus } from './status'

export type UploadTaskOutput = Pick<
    IssueTaskOutput,
    'issuePublication' | 'message' | 'issue'
>
export const handler: Handler<MediaTaskOutput, UploadTaskOutput> = async ({
    issuePublication,
    issue,
}) => {
    const { publishedId } = issue
    const issueUpload = await attempt(
        upload(issuePath(publishedId), issue, 'application/json', ONE_WEEK),
    )
    if (hasFailed(issueUpload)) {
        console.error(JSON.stringify(issueUpload))
        throw new Error('Failed to upload issue file')
    }
    await putStatus(issuePublication, 'assembled')
    return { issuePublication, message: 'Issue uploaded succesfully', issue }
}
