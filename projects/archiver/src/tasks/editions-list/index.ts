import { Handler } from 'aws-lambda'
import { upload, FIVE_SECONDS, getBucket } from '../../utils/s3'
import { handleAndNotify } from '../../services/task-handler'
import { getEditions } from '../../utils/backend-client'
import { hasFailed } from '../../../../backend/utils/try'
import {
    EditionsList,
    IssuePublicationIdentifier,
} from '../../../../Apps/common/src'
import { IndexTaskOutput } from '../indexer'
import { sleep } from '../../utils/sleep'

type EditionsListTaskInput = IndexTaskOutput
interface EditionsListOutput {
    issuePublication: IssuePublicationIdentifier
    editionsList: EditionsList
}
/**
 * This step uploads the editionsList (fetched from /editions endpoint) of the backend lambda
 * and uploads it to BOTH the proof and publish buckets. Strictly speaking this step does
 * not need to be run every time an issue is published as editions will be added rarely, and independently
 * of issue publication, but including the step here keeps everything in one place and ensures the list will
 * remain up to date. There's no need to proof first as we would expect the visibility of a new edition to be
 * controlled by a launch date/feature switch rather than it's presence in the API.
 */
const proofBucket = getBucket('proof')
const publishBucket = getBucket('publish')
export const handler: Handler<
    EditionsListTaskInput,
    EditionsListOutput
> = handleAndNotify(
    'editionsListUpdated',
    async ({ issuePublication }) => {
        console.log(`Uploading editions list file`)
        await sleep(1000)

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

        return {
            editionsList,
            issuePublication,
        }
    },
    proofBucket,
)
