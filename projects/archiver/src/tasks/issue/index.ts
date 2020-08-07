import { Handler } from 'aws-lambda'
import { attempt, hasFailed } from '../../../../backend/utils/try'
import { Issue, IssuePublicationActionIdentifier } from '../../../common'
import { getIssue } from '../../utils/backend-client'
import { getBucket } from '../../utils/s3'
import { getPublishedId } from '../../utils/path-builder'
import { handleAndNotify } from '../../services/task-handler'

export interface IssueParams {
    issuePublication: IssuePublicationActionIdentifier
}
export interface IssueTaskOutput extends IssueParams {
    issue: Issue
    message?: string
}

const Bucket = getBucket('proof')

export const handler: Handler<IssueParams, IssueTaskOutput> = handleAndNotify(
    'started',
    async ({ issuePublication }) => {
        console.log(
            `Attempting to upload ${JSON.stringify(issuePublication)} to ${
                Bucket.name
            }`,
        )
        const publishedId = getPublishedId(issuePublication)
        const issue = await attempt(getIssue(publishedId))
        if (hasFailed(issue)) {
            console.log(JSON.stringify(issue))
            throw new Error('Failed to download issue.')
        }
        console.log(`Downloaded issue ${JSON.stringify(issuePublication)}`)

        const { fronts } = issue

        if (fronts.length == 0) {
            throw new Error(`No fronts found on '${publishedId}' issue`)
        }

        return {
            issuePublication,
            issue,
            message: 'Fetched issue successfully.',
        }
    },
    Bucket,
)
