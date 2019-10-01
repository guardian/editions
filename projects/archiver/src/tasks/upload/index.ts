import { Handler } from 'aws-lambda'
import { attempt, hasFailed } from '../../../../backend/utils/try'
import { issuePath } from '../../../common'
import { ImageTaskOutput } from '../image'
import { IssueTaskOutput } from '../issue'
import { upload, ONE_WEEK } from '../../utils/s3'
import { putStatus } from '../../services/status'
import { logInput, logOutput } from '../../utils/log'
import { handleAndNotify } from '../../services/pub-status-notifier'

type UploadTaskInput = ImageTaskOutput
export type UploadTaskOutput = Pick<
    IssueTaskOutput,
    'issuePublication' | 'message' | 'issue'
>
export const handler: Handler<UploadTaskInput, UploadTaskOutput> = async ({
    issuePublication,
    issue,
}) => {
    return await handleAndNotify(issuePublication, 'assembled', async () => {
        logInput({
            issuePublication,
            issue,
        })
        const { publishedId } = issue
        const issueUpload = await attempt(
            upload(issuePath(publishedId), issue, 'application/json', ONE_WEEK),
        )
        if (hasFailed(issueUpload)) {
            console.error(JSON.stringify(issueUpload))
            throw new Error('Failed to upload issue file')
        }
        await putStatus(issuePublication, 'assembled')
        const out: UploadTaskOutput = {
            issuePublication,
            message: 'Issue uploaded succesfully',
            issue,
        }
        logOutput(out)
        return out
    })
}
