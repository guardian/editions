import {
    S3,
    ChainableTemporaryCredentials,
    SharedIniFileCredentials,
} from 'aws-sdk'
import { attempt, notNull } from '../../common'
import { oc } from 'ts-optchain'
import { ListObjectsV2Output } from 'aws-sdk/clients/s3'

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

export const getBucket = (bucket: string): string => {
    if (bucket === 'proof') {
        if (!!process.env.proofBucket) {
            console.log('Returning proofBucket env var')
            return process.env.proofBucket
        } else {
            console.log(
                'Returning default bucket editions-store-code for proof bucket',
            )
            return 'editions-store-code'
        }
    } else if (bucket === 'publish') {
        if (!!process.env.publishBucket) {
            console.log('Returning publishBucket env var')
            return process.env.publishBucket
        } else {
            console.log(
                'Returning default bucket editions-store-code for publish bucket',
            )
            return 'editions-store-code'
        }
    } else {
        return 'editions-store-code'
    }
}

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
    bucketName: string,
    mime: 'image/jpeg' | 'application/json' | 'application/zip',
    maxAge: number | undefined,
): Promise<{ etag: string }> => {
    return new Promise((resolve, reject) => {
        s3.upload(
            {
                Body: body instanceof Buffer ? body : JSON.stringify(body),
                Bucket: bucketName,
                Key: `${key}`,
                ACL: 'public-read',
                ContentType: mime,
                CacheControl: cacheControlHeader(maxAge),
            },
            (err, data) => {
                if (err) {
                    console.error(
                        `S3 upload of s3://${bucketName}/${key} failed with`,
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

export const list = (
    inputBucket: string,
    baseKey: string,
): Promise<{ objects: ListObjectsV2Output }> => {
    return new Promise((resolve, reject) => {
        s3.listObjectsV2(
            {
                Bucket: inputBucket,
                Delimiter: '/',
                Prefix: baseKey,
            },
            function(err, data) {
                if (err) {
                    console.error(
                        `S3 listing of s3://${inputBucket}/${baseKey} failed with`,
                        err,
                    )
                    reject()
                    return
                }
                console.log(`Keys below ${baseKey} fetched from ${inputBucket}`)
                console.log(data.Contents)
                resolve({ objects: data })
            },
        )
    })
}

export const copy = (
    key: string,
    inputBucket: string,
    outputBucket: string,
): Promise<{}> => {
    return new Promise((resolve, reject) => {
        s3.copyObject(
            {
                Bucket: outputBucket,
                CopySource: `${inputBucket}/${key}`,
                Key: `${key}`,
            },
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            (err, data) => {
                if (err) {
                    console.error(
                        `S3 copy of s3://${inputBucket}/${key} to s3://${outputBucket}/${key} failed with`,
                        err,
                    )
                    reject()
                    return
                }
                console.log(`${key} copied to ${outputBucket}`)
                resolve({})
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

export const recursiveCopy = async (
    inputBucket: string,
    outputBucket: string,
    baseKey: string,
): Promise<{}[]> => {
    const listing = await list(inputBucket, baseKey)
    const keys = listing.objects.Contents!
    const subfolders = listing.objects.CommonPrefixes!

    // Loop over creating copy promises
    const copyPromises = await Promise.all(
        keys.map(object =>
            attempt(copy(object.Key!, inputBucket, outputBucket)),
        ),
    )
    // Loop over creating recursive copy promises
    const recursionPromises = await Promise.all(
        subfolders.map(object =>
            attempt(recursiveCopy(inputBucket, outputBucket, object.Prefix!)),
        ),
    )
    // Gather the promises into one array and return
    return copyPromises.concat(recursionPromises)
}
