import { S3 } from 'aws-sdk'
const s3 = new S3()
const stage = 'CODE'

export const s3fetch = async (key: string) => {
    const k = `${stage}/${key}`
    console.log(k)
    const result = await s3
        .getObject({
            Key: k,
            Bucket: 'facia-tool-store',
        })
        .promise()
    const body = result.Body
    if (body == null) throw new Error('Not found.')
    return {
        text: async () => body.toString(),
        json: async () => JSON.parse(body.toString()),
        lastModified: result.LastModified,
    }
}
