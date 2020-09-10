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
import { notNull } from './common'

export interface Path {
    key: string
    bucket: 'published' | 'preview' | 'store' | 'proof'
}
const stage = process.env.frontsStage || 'code'

const getFrontsBucket = (bucketType: Path['bucket']) =>
    `${bucketType}-editions-${stage.toLowerCase()}`

const getEditionsBucket = (bucketType: string) =>
    `editions-${bucketType}-${stage.toLowerCase()}`

if (process.env.arn) {
    console.log(`Creating S3 client with role arn: ${process.env.arn}`)
}

const s3FrontsClient = new S3({
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

const s3EditionClient = () => {
    if (process.env.stage === 'CODE' || process.env.stage === 'PROD') {
        console.log(
            `Using default credentials for editions S3 client, stage: ${process.env.stage}`,
        )
        return new S3({ region: 'eu-west-1' })
    } else {
        console.log(
            `Using shared credentials file. stage: ${process.env.stage}`,
        )
        return new S3({
            region: 'eu-west-1',
            credentials: new SharedIniFileCredentials({
                profile: 'frontend',
            }),
        })
    }
}

interface S3Response {
    text: () => Promise<string>
    json: () => Promise<{}>
    lastModified?: Date
    etag: string | undefined
}

export const s3List = async (
    path: Path,
): Promise<
    Attempt<
        {
            key: string
            lastModified: Date
        }[]
    >
> => {
    const response = await attempt(
        s3FrontsClient
            .listObjectsV2({
                Bucket: getFrontsBucket(path.bucket),
                Prefix: path.key,
            })
            .promise(),
    )
    if (hasFailed(response)) {
        return withFailureMessage(
            response,
            `S3 Access failed for path ${JSON.stringify(
                path,
            )} in ${getFrontsBucket(path.bucket)}`,
        )
    }
    if (response.KeyCount === 0) {
        return failure({
            httpStatus: 404,
            error: new Error(
                `No keys returned from listObject of ${JSON.stringify(path)}`,
            ),
        })
    }
    const contents = response.Contents

    if (!contents) throw new Error(`Nothing at ${JSON.stringify(path)}`)

    return contents
        .map(item => {
            if (item.Key == null || item.LastModified == null) return null
            return { key: item.Key, lastModified: item.LastModified }
        })
        .filter(notNull)
}
export const s3fetch = (path: Path): Promise<Attempt<S3Response>> => {
    return new Promise(resolve => {
        s3FrontsClient.getObject(
            {
                Key: path.key,
                Bucket: getFrontsBucket(path.bucket),
            },
            (error, result) => {
                if (error && error.code == 'NoSuchKey') {
                    resolve(
                        failure({
                            httpStatus: 404,
                            error: new Error(
                                `Could not find key ${JSON.stringify(path)}`,
                            ),
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
                                `Neither result nor error in s3 response for  ${JSON.stringify(
                                    path,
                                )}`,
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
                            error: new Error(
                                `Undefined body for ${JSON.stringify(path)}`,
                            ),
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

export const s3Put = async (path: Path, data: string) => {
    await s3EditionClient()
        .putObject({
            ACL: 'public-read',
            Key: path.key,
            Bucket: getEditionsBucket(path.bucket),
            Body: data,
            ContentType: 'application/json',
            CacheControl: `max-age=60`,
        })
        .promise()
        .catch(error => {
            console.error(
                `S3 putObject failed. bucket ${getEditionsBucket(
                    path.bucket,
                )} key: ${path.key} `,
                error,
            )
            throw error
        })
}
