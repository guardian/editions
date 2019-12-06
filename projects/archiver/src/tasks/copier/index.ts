import { Handler } from 'aws-lambda'
import { handleAndNotify } from '../../services/task-handler'
import { IssueTaskOutput } from '../issue'
import { IndexTaskOutput } from '../indexer'
import { copy, getBucket, list } from '../../utils/s3'
import { issuePath } from '../../../../Apps/common/src'
import { attempt, hasFailed } from '../../../../backend/utils/try'

type CopyTaskInput = IndexTaskOutput
export type CopyTaskOutput = Pick<
    IssueTaskOutput,
    'issuePublication' | 'message' | 'issue'
>

export const handler: Handler<CopyTaskInput, CopyTaskOutput> = handleAndNotify(
    'copied',
    async ({ issuePublication, issue }) => {
        const inputBucket = getBucket('proof')
        const outputBucket = getBucket('publish')
        console.log(`Copying all files from ${inputBucket} to ${outputBucket}`)
        // List all keys
        const keys = await list(
            inputBucket,
            issue.key + '/' + issuePublication.version + '/',
        )

        // Loop over them creating copy promises
        // Gather the promises into one and return
        const copyPromises = await Promise.all(
            keys.objects.map(key =>
                attempt(copy(key.toString(), inputBucket, outputBucket)),
            ),
        )

        if (copyPromises.filter(hasFailed).length)
            throw new Error('Failed to copy some objects')

        return {
            issuePublication,
            message: 'Issue copied successfully',
            issue,
        }
    },
)
