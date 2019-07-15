import { PassThrough } from 'stream'
import archiver = require('archiver')
import { s3, bucket } from './s3'

const notNull = <T>(value: T | null | undefined): value is T =>
    value !== null && value !== undefined

const removeInitial = (s: string, remove: string) => {
    if (!s.startsWith(remove)) return s
    return s.substr(remove.length)
}

export const zip = async (
    name: string,
    root: 'data' | 'media',
    prefix: string,
) => {
    const output = new PassThrough()
    const upload = s3
        .upload({
            Bucket: bucket,
            Key: `zips/${name}.zip`,
            Body: output,
            ACL: 'public-read',
        })
        .promise()

    const objects = await s3
        .listObjectsV2({
            Bucket: bucket,
            Prefix: `${root}/${prefix}`,
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
                .getObject({ Bucket: bucket, Key: file })
                .promise()
            if (s3response.Body == null) return false
            console.log(`adding ${file} to zip`)

            archive.append(s3response.Body as string, {
                name: removeInitial(file, root),
            })
        }),
    )
    console.log('Finished adding to zip, finalizing.')
    await archive.finalize()
    await upload
}
