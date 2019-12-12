import {
    Edition,
    IssueIdentifier,
    IssuePublicationIdentifier,
    IssueSummary,
    notNull,
} from '../../../../common'
import { getIssuesBy as getIssuesByEdition, issueWindow } from './get-issues'
import { getIssueSummary } from './get-issue-summary'
import { getPublishedVersion } from './get-published-version'
import { oc } from 'ts-optchain'
import { Bucket } from '../../../utils/s3'

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

    const recentIssues = issueWindow(allEditionIssues, 7)

    // filter out the one we are currently publishing and return
    return recentIssues.filter(
        issue => issue.issueDate !== oc(currentlyPublishing).issueDate(),
    )
}

// currently publishing will remove this issue from the index, it should be generated in the indextask
export const getOtherIssuesSummariesForEdition = async (
    currentlyPublishing: IssuePublicationIdentifier,
    edition: Edition,
    bucket: Bucket,
): Promise<IssueSummary[]> => {
    const allEditionIssues = await getIssuesByEdition(edition, bucket)

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
        otherRecentIssuesForEdition.map(issue =>
            getPublishedVersion(issue, bucket),
        ),
    )
    return (await Promise.all(
        issuePublications
            .filter(notNull)
            .map(issuePub => getIssueSummary(issuePub, bucket)),
    )).filter(notNull)
}
