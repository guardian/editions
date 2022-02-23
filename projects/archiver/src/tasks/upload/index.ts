import { Handler } from 'aws-lambda'
import { attempt, hasFailed } from '../../../../backend/utils/try'
import { issuePath } from '../../../common'
import { handleAndNotify } from '../../services/task-handler'
import { getBucket, ONE_WEEK, upload } from '../../utils/s3'
import { IssueTaskOutput } from '../issue'
import { sleep } from '../../utils/sleep'

type UploadTaskInput = IssueTaskOutput
export type UploadTaskOutput = Pick<
    IssueTaskOutput,
    'issuePublication' | 'message' | 'issue'
>

const Bucket = getBucket('proof')

export const handler: Handler<UploadTaskInput, UploadTaskOutput> =
    handleAndNotify(
        'assembled',
        async ({ issuePublication, issue }) => {
            console.log(`Uploading issue for ${issue.name}, ${issue.date}`)
            await sleep(1000)

            const { publishedId } = issue
            const path = issuePath(publishedId)
            const Bucket = getBucket('proof')
            const issueUpload = await attempt(
                upload(path, issue, Bucket, 'application/json', ONE_WEEK),
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
        },
        Bucket,
    )
