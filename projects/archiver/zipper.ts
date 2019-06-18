import { S3, SharedIniFileCredentials } from 'aws-sdk'
import { PassThrough } from 'stream'
import archiver = require('archiver')

const creds = process.env.arn
    ? {}
    : {
          credentials: new SharedIniFileCredentials({ profile: 'frontend' }),
      }
const s3 = new S3({
    region: 'eu-west-1',
    ...creds,
})

const notNull = <T>(value: T | null | undefined): value is T =>
    value !== null && value !== undefined

export const zipIssue = async (issue: string) => {
    const output = new PassThrough()
    const upload = s3
        .upload({
            Bucket: 'editions-store',
            Key: `zips/${issue}.zip`,
            Body: output,
            ACL: 'public-read',
        })
        .promise()
    const prefix = `issue/${issue}/`
    const objects = await s3
        .listObjectsV2({
            Bucket: 'editions-store',
            Prefix: prefix,
        })
        .promise()
    const files = (objects.Contents || []).map(obj => obj.Key).filter(notNull)
    console.log('Got file names')

    const archive = archiver('zip')
    archive.on('warning', err => {
        console.error('Error in attempting to compress', err)
    })
    archive.pipe(output)
    await Promise.all(
        files.map(async file => {
            console.log(`getting ${file}`)
            const s3response = await s3
                .getObject({ Bucket: 'editions-store', Key: file })
                .promise()
            if (s3response.Body == null) return false
            console.log(`adding ${file} to zip`)

            archive.append(s3response.Body as string, { name: file })
        }),
    )
    console.log('Finished adding to zip, finalizing.')
    await archive.finalize()
    await upload
}
