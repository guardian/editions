import { Handler } from 'aws-lambda'
import { attempt, hasFailed } from '../../backend/utils/try'
import { Issue, IssuePublicationIdentifier } from '../common'
import { getIssue } from './downloader'
import { Bucket } from './s3'
import { getPublishedId } from './publishedId'
import { putStatus } from './status'

export interface IssueParams {
    issuePublication: IssuePublicationIdentifier
}
export interface IssueTaskOutput extends IssueParams {
    issue: Issue
    message?: string
    fronts: string[]
    remainingFronts: number
}
export const handler: Handler<IssueParams, IssueTaskOutput> = async ({
    issuePublication,
}) => {
    console.log(
        `Attempting to upload ${JSON.stringify(issuePublication)} to ${Bucket}`,
    )
    await putStatus(issuePublication, 'started')
    const publishedId = getPublishedId(issuePublication)
    const issue = await attempt(getIssue(publishedId))
    if (hasFailed(issue)) {
        console.log(JSON.stringify(issue))
        throw new Error('Failed to download issue.')
    }
    console.log(`Downloaded issue ${JSON.stringify(issuePublication)}`)
    return {
        issuePublication,
        issue: { ...issue, fronts: [] },
        fronts: issue.fronts,
        remainingFronts: issue.fronts.length,
        message: 'Fetched issue succesfully.',
    }
}
