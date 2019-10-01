import { IssuePublicationIdentifier } from '../../../../../common/src'
import { IssueSummary, notNull } from '../../../../common'
import { getIssues, issueWindow } from './get-issues'
import { getIssueSummary } from './get-issue-summary'
import { getPublishedVersion } from './get-published-version'
import { oc } from 'ts-optchain'

// currently publishing will remove this issue from the index, it should be generated in the indextask
export const indexer = async (
    currentlyPublishing?: IssuePublicationIdentifier,
): Promise<IssueSummary[]> => {
    const allIssues = await getIssues()
    const recentIssues = issueWindow(allIssues, 7)

    // filter out the one we are currently publishing
    const existingRecentIssues = recentIssues.filter(
        issue => issue.issueDate !== oc(currentlyPublishing).issueDate(),
    )

    const issuePublications = await Promise.all(
        existingRecentIssues.map(getPublishedVersion),
    )
    return (await Promise.all(
        issuePublications.filter(notNull).map(getIssueSummary),
    )).filter(notNull)
}
