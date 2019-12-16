import { Handler } from 'aws-lambda'
import { IssueSummary, issueSummarySort } from '../../../common'
import { getIssueSummary } from './helpers/get-issue-summary'
import { getOtherIssuesSummariesForEdition } from './helpers/summary'
import { upload, FIVE_SECONDS, getBucket } from '../../utils/s3'
import { UploadTaskOutput } from '../upload'
import { handleAndNotify } from '../../services/task-handler'
import { Status } from '../../services/status'

type IndexTaskInput = UploadTaskOutput
export interface IndexTaskOutput extends UploadTaskOutput {
    issueSummary: IssueSummary
    index: IssueSummary[]
}

const handlerCurry: (
    bucket: string,
    statusOnSuccess: Status,
) => Handler<IndexTaskInput, IndexTaskOutput> = (bucket, statusOnSuccess) =>
    handleAndNotify(
        statusOnSuccess,
        async ({ issuePublication, issue }) => {
            const Bucket = getBucket(bucket)
            // at the moment we create and recreate these issue summaries every time
            // an optimisation would be to move the issue summary creation to the previous task
            // so it would only have to be done once and can easily be read in and stiched together
            const thisIssueSummary = await getIssueSummary(
                issuePublication,
                Bucket,
            )

            if (thisIssueSummary == undefined) {
                throw new Error(
                    'No issue summary was generated for the current issue',
                )
            }

            console.log('thisIssueSummary:', JSON.stringify(thisIssueSummary))

            const { edition } = issuePublication

            const otherIssuesSummariesForEdition = await getOtherIssuesSummariesForEdition(
                issuePublication,
                edition,
                Bucket,
            )

            console.log(
                'otherIssuesSummariesForEdition:',
                JSON.stringify(otherIssuesSummariesForEdition),
            )

            console.log(
                `Creating index using the new and ${otherIssuesSummariesForEdition.length} existing issue summaries`,
            )

            const all = [thisIssueSummary, ...otherIssuesSummariesForEdition]
            const allSortedEditionsIssues = issueSummarySort(all)

            await upload(
                `${issuePublication.edition}/issues`,
                allSortedEditionsIssues,
                Bucket,
                'application/json',
                FIVE_SECONDS,
            )

            // Also upload the index into the root for older clients
            // TODO: this can be removed once we are happy that the clients are consuming the namespaced index
            if (issuePublication.edition === 'daily-edition') {
                await upload(
                    'issues',
                    allSortedEditionsIssues,
                    Bucket,
                    'application/json',
                    FIVE_SECONDS,
                )
            }

            console.log('Uploaded new issues file')

            return {
                issuePublication,
                index: otherIssuesSummariesForEdition,
                issue,
                issueSummary: thisIssueSummary,
            }
        },
        getBucket(bucket),
    )

export const handlerProof = handlerCurry('proof', 'proofed')
export const handlerPublish = handlerCurry('publish', 'published')
