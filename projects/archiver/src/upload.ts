import { s3, bucket } from './s3'

export const upload = (
    key: string,
    body: {} | Buffer,
    mime: 'image/jpeg' | 'application/json' | 'application/zip',
): Promise<{ etag: string }> => {
    return new Promise((resolve, reject) => {
        s3.upload(
            {
                Body: body instanceof Buffer ? body : JSON.stringify(body),
                Bucket: bucket,
                Key: `${key}`,
                ACL: 'public-read',
                ContentType: mime,
            },
            (err, data) => {
                if (err) {
                    console.error(
                        `S3 upload of s3://${bucket}/${key} failed with`,
                    )
                    console.error(err)
                    reject()
                    return
                }
                console.log(`${data.Key} uploaded to ${data.Bucket}`)
                resolve({ etag: data.ETag })
            },
        )
    })
}
