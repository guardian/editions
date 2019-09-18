import { Handler } from 'aws-lambda'
import { IssueSummary } from '../common'
import { getIssueSummary } from './indexer/getIssueSummary'
import { indexer } from './indexer/summary'
import { upload, FIVE_SECONDS } from './upload'
import { UploadTaskOutput } from './issueUploadTask'
import { putStatus } from './status'

export interface IndexTaskOutput extends UploadTaskOutput {
    message: string
    issueSummary: IssueSummary
    index: IssueSummary[]
}
export const handler: Handler<UploadTaskOutput, IndexTaskOutput> = async ({
    issuePublication,
    issue,
}) => {
    const index = await indexer(issuePublication)
    const issueSummary = await getIssueSummary(issuePublication)
    if (issueSummary == undefined) {
        throw new Error('No issue summary was generated for the current issue')
    }
    await upload('issues', [issueSummary, ...index], 'application/json', FIVE_SECONDS)
    await putStatus(issuePublication, 'built')
    return {
        issuePublication,
        index,
        issue,
        issueSummary,
        message: `Index regenerated`,
    }
}
