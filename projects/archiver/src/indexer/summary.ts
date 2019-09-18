import { attempt, hasFailed } from '../../../backend/utils/try'
import { IssuePublication } from '../../../common/src'
import { IssueSummary, notNull } from '../../common'
import { upload, FIVE_SECONDS } from '../upload'
import { getIssues, issueWindow } from './getIssues'
import { getIssueSummary } from './getIssueSummary'
import { getPublishedVersion } from './getPublishedVersion'

//currently publishing will remove this issue from the index, it should be generated in the indextask
export const indexer = async (
    currentlyPublishing?: IssuePublication,
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

export const summary = async () => {
    const index = await attempt(indexer())
    if (hasFailed(index)) {
        console.error(index)
        console.error('Could not fetch index')
        return
    }
    await upload('issues', index, 'application/json', FIVE_SECONDS)
    return
}
