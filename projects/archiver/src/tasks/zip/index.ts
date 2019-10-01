import { Handler } from 'aws-lambda'
import { imageSizes, issueDir, mediaDir } from '../../../common'
import { zip } from './helpers/zipper'
import { UploadTaskOutput } from '../upload'
import { putStatus } from '../../services/status'
import { logInput, logOutput } from '../../utils/log'
import { handleAndNotify } from '../../services/task-handler'

type ZipTaskInput = UploadTaskOutput
type ZipTaskOutput = UploadTaskOutput
export const handler: Handler<ZipTaskInput, ZipTaskOutput> = handleAndNotify(
    'bundled',
    async ({ issuePublication, issue }) => {
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
        return {
            issuePublication,
            issue,
            message: `Issue ${issueDate} zipped`,
        }
    },
)
