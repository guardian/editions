import { Handler } from 'aws-lambda'
import {
    imageSizes,
    mediaDir,
    issuePath,
    frontPath,
    ImageSize,
} from '../../../common'
import { zip } from './helpers/zipper'
import { UploadTaskOutput } from '../upload'
import { handleAndNotify } from '../../services/task-handler'
import { thumbsDir } from '../../../../Apps/common/src'
import { getBucket } from '../../utils/s3'

type ZipTaskInput = UploadTaskOutput
type ZipTaskOutput = UploadTaskOutput

const bucket = getBucket('proof')

export const handler: Handler<ZipTaskInput, ZipTaskOutput> = handleAndNotify(
    'bundled',
    async ({ issuePublication, issue }) => {
        const { issueDate, version } = issuePublication
        const { publishedId } = issue
        console.log('Compressing')
        await zip(
            `${publishedId}/data`,
            [issuePath(publishedId), frontPath(publishedId, '')],
            {
                removeFromOutputPath: `${version}/`,
            },
            bucket,
        )

        console.log(`data zip uploaded to: s3://${bucket.name}/${publishedId}`)

        await Promise.all(
            imageSizes.map(
                async (size): Promise<[ImageSize, string]> => {
                    const imgUpload = await zip(
                        `${publishedId}/${size}`,
                        [
                            thumbsDir(publishedId, size),
                            mediaDir(publishedId, size),
                        ],
                        {
                            removeFromOutputPath: `${version}/`,
                        },
                        bucket,
                    )

                    console.log(` ${size}   media zip uploaded`)
                    return [size, imgUpload.Key]
                },
            ),
        )
        console.log('Media zips uploaded.')
        return {
            issuePublication,
            issue,
            message: `Issue ${issueDate} zipped`,
        }
    },
    bucket,
)
