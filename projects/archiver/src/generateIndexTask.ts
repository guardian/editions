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
    console.log(
        'generateIndexTask handler',
        JSON.stringify(issuePublication),
        JSON.stringify(issue),
    )

    // at the moment we create and recreate these issue summaries every time
    // an optimisation would be to move the issue summary creation to the previous task
    // so it would only have to be done once and can easily be read in and stiched together
    const thisIssueSummary = await getIssueSummary(issuePublication)

    if (thisIssueSummary == undefined) {
        throw new Error('No issue summary was generated for the current issue')
    }

    const otherIssueSummaries = await indexer(issuePublication)

    console.log(
        `Creating index using the new and ${otherIssueSummaries.length} existing issue summaries`,
    )

    await upload(
        'issues',
        [thisIssueSummary, ...otherIssueSummaries],
        'application/json',
        FIVE_SECONDS,
    )

    console.log('Uploaded new issues file')

    await putStatus(issuePublication, 'indexed')

    return {
        issuePublication,
        index: otherIssueSummaries,
        issue,
        issueSummary: thisIssueSummary,
        message: `Index regenerated`,
    }
}
