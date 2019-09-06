import { Handler } from 'aws-lambda'
import { attempt, hasFailed } from '../../backend/utils/try'
import { issuePath } from '../common'
import { MediaTaskOutput } from './imageTask'
import { IssueTaskOutput } from './issueTask'
import { upload } from './upload'

export type UploadTaskOutput = Pick<IssueTaskOutput, 'issueId' | 'message'>
export const handler: Handler<MediaTaskOutput, UploadTaskOutput> = async ({
    issueId,
    issue,
}) => {
    const issueUpload = await attempt(
        upload(issuePath(issueId), issue, 'application/json'),
    )
    if (hasFailed(issueUpload)) {
        console.error(JSON.stringify(issueUpload))
        throw new Error('Failed to upload issue file')
    }
    return { issueId, message: 'Issue uploaded succesfully' }
}
