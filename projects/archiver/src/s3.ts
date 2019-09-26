import { S3 } from 'aws-sdk'
import { notNull } from '../common'
import { oc } from 'ts-optchain'

export const s3 = new S3({
    region: 'eu-west-1',
})

export const Bucket = process.env.bucket || 'editions-store-code'

/* List nested prefixes in a given prefix
 */
export const listNestedPrefixes = async (
    bucket: string,
    prefix: string,
): Promise<string[]> => {
    const resp = await s3
        .listObjectsV2({
            Bucket: bucket,
            Prefix: `${prefix}/`,
            Delimiter: '/',
        })
        .promise()
    const prefixes = oc(resp)
        .CommonPrefixes([])
        .map(_ => _.Prefix)
        .filter(notNull)
    return prefixes.map(prefix => {
        if (prefix.endsWith('/')) {
            return prefix.slice(0, -1)
        }
        return prefix
    })
}
