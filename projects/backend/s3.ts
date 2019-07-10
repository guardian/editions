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
    status: number
    ok: true
    text: () => Promise<string>
    json: () => Promise<{}>
    lastModified?: Date
    etag: string | undefined
}

export const s3Latest = async (prefix: string): Promise<string> => {
    console.log(prefix, 'ssss')
    const response = await s3
        .listObjectsV2({
            Bucket: bucket,
            Prefix: prefix,
        })
        .promise()
    const contents = response.Contents
    console.log(JSON.stringify(response))
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
    return latest.Key
}

export const s3fetch = (key: string): Promise<S3Response> => {
    return new Promise((resolve, reject) => {
        s3.getObject(
            {
                Key: key,
                Bucket: bucket,
            },
            (error, result) => {
                if (error && error.code == 'NoSuchKey') {
                    reject({ status: 404, ok: false })
                    return
                }
                if (result == null) debugger
                if (error) reject(error)

                if (result == undefined) {
                    reject(new Error('No result!.'))
                    return
                }
                const body = result.Body

                if (body == undefined) {
                    reject(new Error('Not found.'))
                    return
                }

                resolve({
                    status: 200,
                    ok: true,
                    text: async () => body.toString(),
                    json: async () => JSON.parse(body.toString()),
                    lastModified: result.LastModified,
                    etag: result.ETag,
                })
            },
        )
    })
}
