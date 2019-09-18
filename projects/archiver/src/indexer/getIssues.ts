import { oc } from 'ts-optchain'
import { IssuePublication } from '../../../common/src'
import { notNull } from '../../common'
import { Bucket, s3 } from '../s3'

export const getIssues = async (): Promise<
    Omit<IssuePublication, 'version'>[]
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
