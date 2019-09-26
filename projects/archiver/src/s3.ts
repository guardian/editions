import { S3 } from 'aws-sdk'
import { notNull } from '../common'
import { oc } from 'ts-optchain'

export const s3 = new S3({
    region: 'eu-west-1',
})

export const Bucket = process.env.bucket || 'editions-store-code'

const addDelimiterIfNotPresent = (prefix: string): string => {
    if (prefix.endsWith('/')) {
        return prefix
    }
    return `${prefix}/`
}

const stripSuffix = (input: string, suffix: string): string => {
    if (input.endsWith(suffix)) {
        return input.slice(0, -1 * suffix.length)
    }
    return input
}

const stripPrefix = (input: string, prefix: string): string => {
    if (input.startsWith(prefix)) {
        return input.substring(prefix.length)
    }
    return input
}

/* List nested prefixes in a given prefix
 */
export const listNestedPrefixes = async (
    bucket: string,
    prefix: string,
): Promise<string[]> => {
    const prefixWithDelimiter = addDelimiterIfNotPresent(prefix)
    const resp = await s3
        .listObjectsV2({
            Bucket: bucket,
            Prefix: prefixWithDelimiter,
            Delimiter: '/',
        })
        .promise()
    const prefixList = oc(resp)
        .CommonPrefixes([])
        .map(_ => _.Prefix)
        .filter(notNull)
    return prefixList.map(newPrefix => {
        return stripPrefix(stripSuffix(newPrefix, '/'), prefixWithDelimiter)
    })
}
