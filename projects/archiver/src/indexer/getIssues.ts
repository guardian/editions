import { oc } from 'ts-optchain'
import { IssuePublicationIdentifier, IssueIdentifier } from '../../../common/src'
import { notNull } from '../../common'
import { Bucket, s3 } from '../s3'

/* Crawl S3 for a list of all of the issues that are available */
export const getIssues = async (): Promise<
    IssueIdentifier[]
> => {
    const resp = await s3
        .listObjectsV2({
            Bucket,
            Prefix: 'daily-edition',
            Delimiter: '/',
        })
        .promise()
    const prefixes = oc(resp)
        .CommonPrefixes([])
        .map(_ => _.Prefix)
        .filter(notNull)

    return prefixes.map(issueDate => ({
        edition: 'daily-edition',
        issueDate,
    }))
}

/* Given a list of issues return the set of issues that fall into the 
 * publication window */
export const issueWindow = (
    issues: IssueIdentifier[],
    currentlyPublishing?: IssuePublicationIdentifier,
): IssueIdentifier[] =>
    issues
        .sort(
            (a, b) =>
                new Date(b.issueDate).getTime() -
                new Date(a.issueDate).getTime(),
        )
        .slice(0, 7)
        .filter(
            issue => issue.issueDate !== oc(currentlyPublishing).issueDate(''),
        )
