import { IssueIdentifier, Edition } from '../../../../common'
import { getBucket, listNestedPrefixes } from '../../../utils/s3'

/* Crawl S3 for a list of all of the issues that are available */
export const getIssuesBy = async (
    edition: Edition,
    bucket: string,
): Promise<IssueIdentifier[]> => {
    const Bucket = getBucket(bucket)
    const prefixes = await listNestedPrefixes(Bucket, edition)

    return prefixes.map(issueDate => ({
        edition,
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
