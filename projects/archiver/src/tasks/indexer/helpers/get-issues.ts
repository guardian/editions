import { IssueIdentifier } from '../../../../../common/src'
import { Bucket, listNestedPrefixes } from '../../../utils/s3'

/* Crawl S3 for a list of all of the issues that are available */
export const getIssues = async (): Promise<IssueIdentifier[]> => {
    const prefixes = await listNestedPrefixes(Bucket, 'daily-edition')

    return prefixes.map(issueDate => ({
        edition: 'daily-edition',
        issueDate,
    }))
}

/* Given a list of issues return the set of issues that fall into the
 * publication window (excluding the issue currentlyPublishing) */
export const issueWindow = (
    issues: IssueIdentifier[],
    windowSize: number,
): IssueIdentifier[] =>
    issues
        .sort(
            (a, b) =>
                new Date(b.issueDate).getTime() -
                new Date(a.issueDate).getTime(),
        )
        .slice(0, windowSize)
