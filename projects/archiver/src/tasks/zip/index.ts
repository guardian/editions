import { Handler } from 'aws-lambda'
import { imageSizes, issueDir, mediaDir } from '../../../common'
import { zip } from './helpers/zipper'
import { UploadTaskOutput } from '../upload'
import { handleAndNotify } from '../../services/task-handler'
import { Bucket } from '../../utils/s3'

type ZipTaskInput = UploadTaskOutput
type ZipTaskOutput = UploadTaskOutput
export const handler: Handler<ZipTaskInput, ZipTaskOutput> = handleAndNotify(
    'bundled',
    async ({ issuePublication, issue }) => {
        const { issueDate, version } = issuePublication
        const { publishedId } = issue
        console.log('Compressing')
        await zip(`${publishedId}/data`, publishedId, {
            excludePath: 'media',
            excludePrefixSegment: version,
        })

        console.log(`data zip uploaded to: s3://${Bucket}/${publishedId}`)
        await Promise.all(
            imageSizes.map(async size => {
                await zip(
                    `${publishedId}/${size}`,
                    mediaDir(publishedId, size),
                    {
                        excludePrefixSegment: version,
                    },
                )
                console.log(` ${size} media zip uploaded`)
            }),
        )
        console.log('Media zips uploaded.')
        return {
            issuePublication,
            issue,
            message: `Issue ${issueDate} zipped`,
        }
    },
)
