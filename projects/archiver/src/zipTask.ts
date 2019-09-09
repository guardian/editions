import { Handler } from 'aws-lambda'
import { imageSizes, issueDir, IssueId } from '../common'
import { zip } from '../zipper'
import { UploadTaskOutput } from './issueUploadTask'
import { createHash } from 'crypto'
export interface ZipTaskOutput {
    issueId: IssueId
    message: string
}
export const handler: Handler<UploadTaskOutput, ZipTaskOutput> = async ({
    issueId,
}) => {
    const { id, source } = issueId
    const hash = createHash('md5')
        .update(source)
        .digest('hex')
    const name = `${id}_${hash}`
    console.log('Compressing')
    await zip(name, issueDir(issueId), 'media')

    console.log('data zip uploaded')
    await Promise.all(
        imageSizes.map(async size => {
            await zip(`${name}.${size}`, `${issueDir(issueId)}/media/${size}/`)
            console.log(` ${size} media zip uploaded`)
        }),
    )
    console.log('Media zips uploaded.')
    return {
        issueId,
        message: `Issue ${id} zipped`,
    }
}
