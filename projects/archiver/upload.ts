import { s3, bucket } from './s3'

export const upload = (
    key: string,
    body: {} | Buffer,
): Promise<{ etag: string }> => {
    return new Promise((resolve, reject) => {
        s3.upload(
            {
                Body: body instanceof Buffer ? body : JSON.stringify(body),
                Bucket: bucket,
                Key: `${key}`,
                ACL: 'public-read',
            },
            (err, data) => {
                if (err) {
                    console.error(`S3 upload of ${key} failed with`)
                    console.error(err)
                    reject()
                    return
                }
                resolve({ etag: data.ETag })
            },
        )
    })
}
