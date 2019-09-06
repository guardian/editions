import { Handler } from 'aws-lambda'
import { attempt, hasFailed } from '../../backend/utils/try'
import { Issue, IssueId } from '../common'
import { getIssue } from './downloader'
import { bucket } from './s3'

export interface IssueParams {
    issueId: IssueId
}
export interface IssueTaskOutput {
    issueId: IssueId
    issue: Issue
    message?: string
    fronts: string[]
    remainingFronts: number
}
export const handler: Handler<IssueParams, IssueTaskOutput> = async ({
    issueId,
}) => {
    console.log(`Attempting to upload ${JSON.stringify(issueId)} to ${bucket}`)
    const issue = await attempt(getIssue(issueId))
    if (hasFailed(issue)) {
        console.log(JSON.stringify(issue))
        throw new Error('Failed to download issue.')
    }
    console.log(`Downloaded issue ${JSON.stringify(issueId)}`)
    return {
        issueId,
        issue: { ...issue, fronts: [] },
        fronts: issue.fronts,
        remainingFronts: issue.fronts.length,
        message: 'Fetched issue succesfully.',
    }
}
