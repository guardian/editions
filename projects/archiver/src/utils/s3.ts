import {
    S3,
    ChainableTemporaryCredentials,
    SharedIniFileCredentials,
} from 'aws-sdk'
import { notNull } from '../../common'
import { oc } from 'ts-optchain'

const createCMSFrontsS3Client = () => {
    console.log(`Creating S3 client with role arn: ${process.env.arn}`)
    const options: ChainableTemporaryCredentials.ChainableTemporaryCredentialsOptions = {
        params: {
            RoleArn: process.env.arn as string,
            RoleSessionName: 'front-assume-role-access',
        },
        stsConfig: {},
    }

    const cmsFrontsTmpCreds = new ChainableTemporaryCredentials(options)

    const iniFileCreds = new SharedIniFileCredentials({ profile: 'cmsFronts' })

    return new S3({
        region: 'eu-west-1',
        credentials: process.env.arn ? cmsFrontsTmpCreds : iniFileCreds,
    })
}

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

function cacheControlHeader(maxAge: number | undefined): string {
    if (maxAge) {
        return `max-age=${maxAge}`
    }
    return 'private'
}

export const ONE_WEEK = 3600 * 24 * 7
export const ONE_MINUTE = 60
export const FIVE_SECONDS = 5

export const upload = (
    key: string,
    body: {} | Buffer,
    mime: 'image/jpeg' | 'application/json' | 'application/zip',
    maxAge: number | undefined,
): Promise<{ etag: string }> => {
    return new Promise((resolve, reject) => {
        s3.upload(
            {
                Body: body instanceof Buffer ? body : JSON.stringify(body),
                Bucket,
                Key: `${key}`,
                ACL: 'public-read',
                ContentType: mime,
                CacheControl: cacheControlHeader(maxAge),
            },
            (err, data) => {
                if (err) {
                    console.error(
                        `S3 upload of s3://${Bucket}/${key} failed with`,
                        err,
                    )
                    reject()
                    return
                }
                console.log(`${data.Key} uploaded to ${data.Bucket}`)
                resolve({ etag: data.ETag })
            },
        )
    })
}

export interface GetS3ObjParams {
    Bucket: string
    Key: string
}

const cmsFrontsS3 = createCMSFrontsS3Client()

export const fetchfromCMSFrontsS3 = async (
    params: GetS3ObjParams,
): Promise<string> => {
    return cmsFrontsS3
        .getObject(params)
        .promise()
        .then(data => {
            if (data.Body == null) {
                throw new Error('S3 Object Response body was empty or null')
            }
            return data.Body.toString('utf-8')
        })
        .catch(e => {
            console.error(
                'Could not get content of S3 object for params:',
                params,
                'error: ',
                e,
            )
            throw e
        })
}
