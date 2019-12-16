import { PassThrough } from 'stream'
import archiver = require('archiver')
import { s3, ONE_WEEK, Bucket } from '../../../utils/s3'
import { getMatchingObjects } from './lister'

export const zip = async (
    name: string,
    prefixes: string[],
    options: { removeFromOutputPath?: string },
    bucket: Bucket,
) => {
    const output = new PassThrough()

    const upload = s3
        .upload({
            Bucket: bucket.name,
            Key: `zips/${name}.zip`,
            Body: output,
            ACL: 'public-read',
            ContentType: 'application/zip',
            CacheControl: `max-age=${ONE_WEEK}`,
        })
        .promise()

    const files = await getMatchingObjects(prefixes, bucket)

    console.log('Got file names')
    console.log('zipping', JSON.stringify(files))

    const archive = archiver('zip')
    archive.on('warning', err => {
        console.error('Error in attempting to compress', err)
    })
    archive.pipe(output)

    await Promise.all(
        files.map(async file => {
            const zipPath = options.removeFromOutputPath
                ? file.replace(`${options.removeFromOutputPath}`, '')
                : file
            console.log(`getting ${file}`)
            const s3response = await s3
                .getObject({ Bucket: bucket.name, Key: file })
                .promise()
            if (s3response.Body == null) return false

            archive.append(s3response.Body as Buffer, {
                name: zipPath,
            })
        }),
    )
    console.log(`Finished adding to zip ${name}.zip, finalizing.`)
    await archive.finalize()
    return upload
}
