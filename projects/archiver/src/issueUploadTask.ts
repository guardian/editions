import { Handler } from 'aws-lambda'
import { attempt, hasFailed } from '../../backend/utils/try'
import { issuePath } from '../common'
import { MediaTaskOutput } from './imageTask'
import { IssueTaskOutput } from './issueTask'
import { upload } from './upload'

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
        upload(issuePath(publishedId), issue, 'application/json', 60),
    )
    if (hasFailed(issueUpload)) {
        console.error(JSON.stringify(issueUpload))
        throw new Error('Failed to upload issue file')
    }
    return { issuePublication, message: 'Issue uploaded succesfully', issue }
}
