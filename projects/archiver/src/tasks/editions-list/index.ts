import { Handler } from 'aws-lambda'
import { upload, FIVE_SECONDS, getBucket } from '../../utils/s3'
import { handleAndNotify } from '../../services/task-handler'
import { Status } from '../../services/status'
import { getEditions } from '../../utils/backend-client'
import { hasFailed } from '../../../../backend/utils/try'
import { EditionsList } from '../../../../Apps/common/src'
import { IndexTaskOutput } from '../indexer'

type EditionsListTaskInput = IndexTaskOutput

export const handler: (
    bucket: string,
    statusOnSuccess: Status,
) => Handler<EditionsListTaskInput, EditionsList> = (bucket, statusOnSuccess) =>
    handleAndNotify(
        statusOnSuccess,
        async () => {
            const proofBucket = getBucket('proof')
            const publishBucket = getBucket('publish')
            const editionsList = await getEditions()

            if (hasFailed(editionsList)) {
                throw new Error('Failed to fetch editions list')
            }

            await upload(
                'editions',
                editionsList,
                proofBucket,
                'application/json',
                FIVE_SECONDS,
            )

            await upload(
                'editions',
                editionsList,
                publishBucket,
                'application/json',
                FIVE_SECONDS,
            )

            console.log('Uploaded new editions file')

            return editionsList
        },
        getBucket(bucket),
    )
