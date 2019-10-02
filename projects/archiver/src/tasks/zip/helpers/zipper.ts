import { PassThrough } from 'stream'
import archiver = require('archiver')
import { s3, Bucket, ONE_WEEK } from '../../../utils/s3'
import Jimp from 'jimp'
import { jimpEvMethod } from '@jimp/core'

const notNull = <T>(value: T | null | undefined): value is T =>
    value !== null && value !== undefined

export const zip = async (
    name: string,
    prefix: string,
    options: { excludePath?: string; excludePrefixSegment?: string },
) => {
    const output = new PassThrough()
    const upload = s3
        .upload({
            Bucket,
            Key: `zips/${name}.zip`,
            Body: output,
            ACL: 'public-read',
            ContentType: 'application/zip',
            CacheControl: `max-age=${ONE_WEEK}`,
        })
        .promise()

    const objects = await s3
        .listObjectsV2({
            Bucket,
            Prefix: prefix,
        })
        .promise()
    // TODO: deal with paginating S3 responses
    if (objects.IsTruncated) {
        console.error(
            "Object list from S3 was truncated which we don't currently deal with",
        )
    }
    const files = (objects.Contents || []).map(obj => obj.Key).filter(notNull)

    console.log('Got file names')
    const matches =
        options.excludePath !== undefined
            ? files.filter(
                  name => !name.startsWith(`${prefix}/${options.excludePath}`),
              )
            : files

    const archive = archiver('zip')
    archive.on('warning', err => {
        console.error('Error in attempting to compress', err)
    })
    archive.pipe(output)

    await Promise.all(
        matches.map(async file => {
            const zipPath = options.excludePrefixSegment
                ? file.replace(`${options.excludePrefixSegment}/`, '')
                : file
            console.log(`getting ${file}`)
            const s3response = await s3
                .getObject({ Bucket, Key: file })
                .promise()
            if (s3response.Body == null) return false
            console.log(`adding ${file} to zip ${name}`)
            let imageBuf: Buffer | undefined
            if (s3response.ContentType === 'image/jpeg') {
                const image = await Jimp.read(s3response.Body as Buffer)
                image.invert()
                imageBuf = await image.getBufferAsync(Jimp.MIME_JPEG)
            }
            archive.append(imageBuf || (s3response.Body as Buffer), {
                name: zipPath,
            })
        }),
    )
    console.log(`Finished adding to zip ${name}.zip, finalizing.`)
    await archive.finalize()
    return upload
}
