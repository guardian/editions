import { Handler } from 'aws-lambda'
import { head, tail } from 'ramda'
import { attempt, hasFailed } from '../../backend/utils/try'
import { run } from '../main'
export interface Issue {
    source: string
    id: string
}
export interface IssueParams {
    issues: Issue[]
    parsedIssues?: Issue[]
}
export const handler: Handler<
    IssueParams,
    IssueParams & {
        parsed?: Issue
        success: boolean
        message?: string
        finished: boolean
    }
> = async ({ issues, parsedIssues }) => {
    //Should not be called with empty issues, but short circuit if so.
    if (issues.length == 0)
        return { issues, parsedIssues, success: true, finished: true }

    const current = head(issues)
    const remaining = tail(issues)

    const publish = await attempt(run(current.source, current.id))

    if (hasFailed(publish))
        throw new Error(`Failed to publish ${current.source}/${current.id}`)

    return {
        parsed: current,
        success: true,
        issues: remaining,
        parsedIssues: [...(parsedIssues || []), current],
        finished: remaining.length === 0,
    }
}
