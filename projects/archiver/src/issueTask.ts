import { Handler } from 'aws-lambda'
import { attempt, hasFailed } from '../../backend/utils/try'
import { Issue } from '../common'
import { getIssue } from './downloader'
import { bucket } from './s3'
export interface IssueId {
    source: string
    id: string
}
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
    const { source, id } = issueId
    console.log(`Attempting to upload ${id} to ${bucket}`)
    const path = `${source}/${id}`
    const issue = await attempt(getIssue(path))
    if (hasFailed(issue)) {
        console.log(JSON.stringify(issue))
        throw new Error('Failed to download issue.')
    }
    console.log('Downloaded issue', path)
    return {
        issueId,
        issue: { ...issue, fronts: [] },
        fronts: issue.fronts,
        remainingFronts: issue.fronts.length,
        message: 'Fetched issue succesfully.',
    }
}
