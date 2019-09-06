import { Handler } from 'aws-lambda'
import { mediaDir } from '../../common/src'
import { imageSizes, issueDir } from '../common'
import { zip } from '../zipper'
import { UploadTaskOutput } from './issueUploadTask'
export const handler: Handler<UploadTaskOutput, UploadTaskOutput> = async ({
    issuePublication,
    issue,
}) => {
    const { issueDate, version } = issuePublication
    const { publishedId } = issue
    const name = issueDir(publishedId)
    console.log('Compressing')
    await zip(`${name}/data`, issueDir(publishedId), {
        excludePath: 'media',
        excludePrefixSegment: version,
    })

    console.log('data zip uploaded')
    await Promise.all(
        imageSizes.map(async size => {
            await zip(`${name}/${size}`, mediaDir(publishedId, size), {
                excludePrefixSegment: version,
            })
            console.log(` ${size} media zip uploaded`)
        }),
    )
    console.log('Media zips uploaded.')
    return {
        issuePublication,
        issue,
        message: `Issue ${issueDate} zipped`,
    }
}
