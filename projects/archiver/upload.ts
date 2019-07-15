import { s3, bucket } from './s3'

export const upload = (
    root: 'data' | 'media',
    key: string,
    body: {} | Buffer,
) => {
    return s3
        .putObject({
            Body: body instanceof Buffer ? body : JSON.stringify(body),
            Bucket: bucket,
            Key: `${root}/${key}`,
            ACL: 'public-read',
        })
        .promise()
}
