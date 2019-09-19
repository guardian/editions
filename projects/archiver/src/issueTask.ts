import { Handler } from 'aws-lambda'
import { attempt, hasFailed } from '../../backend/utils/try'
import { Issue, IssuePublication } from '../common'
import { getIssue } from './downloader'
import { bucket } from './s3'

export interface IssueParams {
    issuePublication: IssuePublication
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
        `Attempting to upload ${JSON.stringify(issuePublication)} to ${bucket}`,
    )
    const publishedId = `${issuePublication.edition}/${issuePublication.issueDate}/${issuePublication.version}`
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
