import { Handler } from 'aws-lambda'
import { attempt, hasFailed } from '../../backend/utils/try'
import { IssueSummary } from '../common'
import { indexer } from './indexer/summary'
import { upload } from './upload'
import { IssueId } from './issueTask'

export interface IndexTaskOutput {
    issueId: IssueId
    message: string
    index: IssueSummary[]
}
export const handler: Handler<IndexTaskOutput> = async ({ issueId }) => {
    const index = await attempt(indexer())
    if (hasFailed(index)) {
        console.error(index)
        throw new Error('Could not generate index.')
    }
    await upload('issues', index, 'application/json', 'index')
    return {
        issueId,
        index,
        message: `Index regenerated`,
    }
}
