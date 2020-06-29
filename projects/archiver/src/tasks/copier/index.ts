import { Handler } from 'aws-lambda'
import { handleAndNotify } from '../../services/task-handler'
import { IssueTaskOutput } from '../issue'
import { IndexTaskOutput } from '../indexer'
import { getBucket, recursiveCopy } from '../../utils/s3'
import { hasFailed } from '../../../../backend/utils/try'

type CopyTaskInput = IndexTaskOutput
export type CopyTaskOutput = Pick<
    IssueTaskOutput,
    'issuePublication' | 'message' | 'issue'
>

const inputBucket = getBucket('proof')
const outputBucket = getBucket('publish')

export const handler: Handler<CopyTaskInput, CopyTaskOutput> = handleAndNotify(
    'copied',
    async ({ issuePublication }) => {
        console.log(`Copying all files from ${inputBucket} to ${outputBucket}`)

        const key = `${issuePublication.edition}/${issuePublication.issueDate}/${issuePublication.version}/`
        const copyPromises = await recursiveCopy(inputBucket, outputBucket, key)

        if (copyPromises.filter(hasFailed).length)
            throw new Error('Failed to copy some objects')

        const zipCopyPromises = await recursiveCopy(
            inputBucket,
            outputBucket,
            'zips/' + key,
        )

        if (zipCopyPromises.filter(hasFailed).length)
            throw new Error('Failed to copy some zips')

        return {
            issuePublication,
            message: 'Issue copied successfully',
            issue,
        }
    },
    outputBucket,
)
