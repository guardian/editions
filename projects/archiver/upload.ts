import { s3, bucket } from './s3'

export const upload = (key: string, body: {} | Buffer) => {
    return s3
        .putObject({
            Body: body instanceof Buffer ? body : JSON.stringify(body),
            Bucket: bucket,
            Key: `${key}`,
            ACL: 'public-read',
        })
        .promise()
}
