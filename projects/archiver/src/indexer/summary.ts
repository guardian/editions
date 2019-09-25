import { IssuePublicationIdentifier } from '../../../common/src'
import { IssueSummary, notNull } from '../../common'
import { upload, FIVE_SECONDS } from '../upload'
import { getIssues, issueWindow } from './getIssues'
import { getIssueSummary } from './getIssueSummary'
import { getPublishedVersion } from './getPublishedVersion'

//currently publishing will remove this issue from the index, it should be generated in the indextask
export const indexer = async (
    currentlyPublishing?: IssuePublicationIdentifier,
): Promise<IssueSummary[]> => {
    const issues = await getIssues()
    const issuesToIndex = issueWindow(issues, currentlyPublishing)
    const issuePublications = await Promise.all(
        issuesToIndex.map(getPublishedVersion),
    )
    return (await Promise.all(
        issuePublications.filter(notNull).map(getIssueSummary),
    )).filter(notNull)
}
