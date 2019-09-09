import { Handler } from 'aws-lambda'
import { imageSizes, issueDir, IssueId } from '../common'
import { zip } from '../zipper'
import { UploadTaskOutput } from './issueUploadTask'
import { mediaDir } from '../../common/src'
export interface ZipTaskOutput {
    issueId: IssueId
    message: string
}
export const handler: Handler<UploadTaskOutput, ZipTaskOutput> = async ({
    issueId,
}) => {
    const { issueDate, version } = issueId

    const name = issueDir(issueId)
    console.log('Compressing')
    await zip(`${name}/data`, issueDir(issueId), {
        excludePath: 'media',
        excludePrefixSegment: version,
    })

    console.log('data zip uploaded')
    await Promise.all(
        imageSizes.map(async size => {
            await zip(`${name}/${size}`, mediaDir(issueId, size), {
                excludePrefixSegment: version,
            })
            console.log(` ${size} media zip uploaded`)
        }),
    )
    console.log('Media zips uploaded.')
    return {
        issueId,
        message: `Issue ${issueDate} zipped`,
    }
}
