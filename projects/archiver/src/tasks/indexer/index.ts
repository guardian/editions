import { Handler } from 'aws-lambda'
import { IssueSummary } from '../../../common'
import { getIssueSummary } from './helpers/get-issue-summary'
import { indexer } from './helpers/summary'
import { upload, FIVE_SECONDS } from '../../utils/s3'
import { UploadTaskOutput } from '../upload'
import { putStatus } from '../../status-store/status'
import { logInput, logOutput } from '../../utils/log'
import { issueSummarySort } from '../../../common'
import { handleAndNotify } from '../notification/helpers/pub-status-notifier'

type IndexTaskInput = UploadTaskOutput
export interface IndexTaskOutput extends UploadTaskOutput {
    issueSummary: IssueSummary
    index: IssueSummary[]
}
export const handler: Handler<IndexTaskInput, IndexTaskOutput> = async ({
    issuePublication,
    issue,
}) => {
    return handleAndNotify(issuePublication, 'indexed', async () => {
        logInput({
            issuePublication,
            issue,
        })
        // at the moment we create and recreate these issue summaries every time
        // an optimisation would be to move the issue summary creation to the previous task
        // so it would only have to be done once and can easily be read in and stiched together
        const thisIssueSummary = await getIssueSummary(issuePublication)

        if (thisIssueSummary == undefined) {
            throw new Error(
                'No issue summary was generated for the current issue',
            )
        }

        const otherIssueSummaries = await indexer(issuePublication)

        console.log(
            `Creating index using the new and ${otherIssueSummaries.length} existing issue summaries`,
        )

        const allIssues = issueSummarySort([
            thisIssueSummary,
            ...otherIssueSummaries,
        ])

        await upload('issues', allIssues, 'application/json', FIVE_SECONDS)

        console.log('Uploaded new issues file')

        await putStatus(issuePublication, 'indexed')

        const out: IndexTaskOutput = {
            issuePublication,
            index: otherIssueSummaries,
            issue,
            issueSummary: thisIssueSummary,
        }
        logOutput(out)
        return out
    })
}
