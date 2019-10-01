import { Handler } from 'aws-lambda'
import { mediaDir } from '../../../common/src'
import { imageSizes, issueDir } from '../../common'
import { zip } from './zip/zipper'
import { UploadTaskOutput } from './issue-upload-task'
import { putStatus } from '../status-store/status'
import { logInput, logOutput } from '../utils/log'
import { handleAndNotify } from './notifications/pub-status-notifier'

type ZipTaskInput = UploadTaskOutput
type ZipTaskOutput = UploadTaskOutput
export const handler: Handler<ZipTaskInput, ZipTaskOutput> = async ({
    issuePublication,
    issue,
}) => {
    return await handleAndNotify(issuePublication, 'bundled', async () => {
        logInput({
            issuePublication,
            issue,
        })
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
        await putStatus(issuePublication, 'bundled')
        const out: UploadTaskOutput = {
            issuePublication,
            issue,
            message: `Issue ${issueDate} zipped`,
        }
        logOutput(out)
        return out
    })
}
