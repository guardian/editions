import { Handler } from 'aws-lambda'
import { imageSizes, issueDir } from '../common'
import { zip } from './zipper'
import { IssueId } from './issueTask'
import { UploadTaskOutput } from './issueUploadTask'
export interface ZipTaskOutput {
    issueId: IssueId
    message: string
}
export const handler: Handler<UploadTaskOutput, ZipTaskOutput> = async ({
    issueId,
}) => {
    const { id } = issueId

    console.log('Compressing')
    await zip(id, issueDir(id), 'media')

    console.log('data zip uploaded')
    await Promise.all(
        imageSizes.map(async size => {
            await zip(`${id}-${size}`, `${issueDir(id)}/media/${size}/`)
            console.log(` ${size} media zip uploaded`)
        }),
    )
    console.log('Media zips uploaded.')
    return {
        issueId,
        message: `Issue  ${id} zipped`,
    }
}
