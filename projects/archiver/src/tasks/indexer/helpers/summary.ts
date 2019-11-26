import {
    IssueSummary,
    notNull,
    IssuePublicationIdentifier,
    IssueIdentifier,
    Edition,
} from '../../../../common'
import { getIssuesBy as getIssuesByEdition, issueWindow } from './get-issues'
import { getIssueSummary } from './get-issue-summary'
import { getPublishedVersion } from './get-published-version'
import { oc } from 'ts-optchain'

const validate = (allEditionIssues: IssueIdentifier[], edition: Edition) => {
    const otherEditions = allEditionIssues.filter(
        issue => issue.edition != edition,
    )
    if (otherEditions.length > 0) {
        throw new Error(
            'getIssuesByEdition function call failed, issues with more then one edition type received',
        )
    }
}

export const getOtherRecentIssues = (
    currentlyPublishing: IssuePublicationIdentifier,
    allEditionIssues: IssueIdentifier[],
): IssueIdentifier[] => {
    validate(allEditionIssues, currentlyPublishing.edition)

    const recentIssues = issueWindow(allEditionIssues, 30)

    // filter out the one we are currently publishing
    const otherRecentIssues = recentIssues.filter(
        issue => issue.issueDate !== oc(currentlyPublishing).issueDate(),
    )

    return otherRecentIssues
}

// currently publishing will remove this issue from the index, it should be generated in the indextask
export const getOtherIssuesSummariesForEdition = async (
    currentlyPublishing: IssuePublicationIdentifier,
    edition: Edition,
): Promise<IssueSummary[]> => {
    const allEditionIssues = await getIssuesByEdition(edition)

    console.log(
        `allEditionIssues for ${edition}`,
        JSON.stringify(allEditionIssues),
    )

    const otherRecentIssuesForEdition = getOtherRecentIssues(
        currentlyPublishing,
        allEditionIssues,
    )

    console.log(
        `other recent issues for ${edition}`,
        JSON.stringify(otherRecentIssuesForEdition),
    )

    const issuePublications = await Promise.all(
        otherRecentIssuesForEdition.map(getPublishedVersion),
    )
    return (
        await Promise.all(
            issuePublications.filter(notNull).map(getIssueSummary),
        )
    ).filter(notNull)
}
