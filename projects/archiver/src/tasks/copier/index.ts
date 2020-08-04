import { Handler } from 'aws-lambda'
import { handleAndNotify } from '../../services/task-handler'
import { IssueTaskOutput } from '../issue'
import { IndexTaskOutput } from '../indexer'
import { getBucket, recursiveCopy } from '../../utils/s3'
import { attempt, hasFailed } from '../../../../backend/utils/try'
import { getPublishedId } from '../../utils/path-builder'
import { getIssue } from '../../utils/backend-client'
import { sleep } from '../../utils/sleep'
import { ServerlessApplicationRepository } from 'aws-sdk'

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
        await sleep(1000)

        const key = `${issuePublication.edition}/${issuePublication.issueDate}/${issuePublication.version}/`
        const copyPromises = await recursiveCopy(key, inputBucket, outputBucket)

        if (copyPromises.filter(hasFailed).length)
            throw new Error('Failed to copy some objects')

        const zipCopyPromises = await recursiveCopy(
            'zips/' + key,
            inputBucket,
            outputBucket,
        )

        if (zipCopyPromises.filter(hasFailed).length)
            throw new Error('Failed to copy some zips')

        const publishedId = getPublishedId(issuePublication)
        const issue = await attempt(getIssue(publishedId))
        if (hasFailed(issue))
            throw new Error('Failed to find issue after copying')

        return {
            issuePublication,
            issue,
            message: 'Issue copied successfully',
        }
    },
    outputBucket,
)
