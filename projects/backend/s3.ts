import {
    attempt,
    hasFailed,
    Attempt,
    withFailureMessage,
    failure,
} from './utils/try'
import {
    S3,
    SharedIniFileCredentials,
    ChainableTemporaryCredentials,
} from 'aws-sdk'

const s3 = new S3({
    region: 'eu-west-1',
    credentials: process.env.arn
        ? new ChainableTemporaryCredentials({
              params: {
                  RoleArn: process.env.arn as string,
                  RoleSessionName: 'front-assume-role-access',
              },
          })
        : new SharedIniFileCredentials({ profile: 'cmsFronts' }),
})

const stage = process.env.stage || 'code'
const bucket = `published-editions-${stage.toLowerCase()}`

interface S3Response {
    text: () => Promise<string>
    json: () => Promise<{}>
    lastModified?: Date
    etag: string | undefined
}

export const s3Latest = async (
    prefix: string,
): Promise<Attempt<{ key: string }>> => {
    const response = await attempt(
        s3
            .listObjectsV2({
                Bucket: bucket,
                Prefix: prefix,
            })
            .promise(),
    )
    if (hasFailed(response)) {
        return withFailureMessage(response, 'S3 Access failed')
    }
    if (response.KeyCount === 0) {
        return failure({
            httpStatus: 404,
            error: new Error(`No keys returned from listObject of ${prefix}`),
        })
    }
    const contents = response.Contents
    if (!contents) throw new Error(`Nothing at ${prefix}`)
    const keydates = contents
        .map(({ Key, LastModified }) => ({
            Key,
            LastModified,
        }))
        .filter(
            (x): x is { Key: string; LastModified: Date } =>
                x.Key !== null && x.LastModified !== null,
        )
    const latest = keydates.reduce((a, b) =>
        a.LastModified < b.LastModified ? b : a,
    )
    return { key: latest.Key }
}

export const s3fetch = (key: string): Promise<Attempt<S3Response>> => {
    return new Promise(resolve => {
        s3.getObject(
            {
                Key: key,
                Bucket: bucket,
            },
            (error, result) => {
                if (error && error.code == 'NoSuchKey') {
                    resolve(
                        failure({
                            httpStatus: 404,
                            error: new Error(`Could not find key ${key}`),
                        }),
                    )
                    return
                }
                if (error)
                    resolve(
                        failure({
                            httpStatus: 500,
                            error,
                            messages: [error.message],
                        }),
                    )

                if (result == undefined) {
                    resolve(
                        failure({
                            httpStatus: 500,
                            error: new Error(
                                `Neither result nor error in s3 response for ${key}`,
                            ),
                        }),
                    )
                    return
                }
                const body = result.Body

                if (body == undefined) {
                    resolve(
                        failure({
                            httpStatus: 500,
                            error: new Error(`Undefined body for ${key}`),
                        }),
                    )
                    return
                }

                resolve({
                    text: async () => body.toString(),
                    json: async () => JSON.parse(body.toString()),
                    lastModified: result.LastModified,
                    etag: result.ETag,
                })
            },
        )
    })
}
