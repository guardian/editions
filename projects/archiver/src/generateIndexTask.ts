import { Handler } from 'aws-lambda'
import { attempt, hasFailed } from '../../backend/utils/try'
import { IssueCompositeKey, IssueSummary } from '../common'
import { indexer } from './indexer/summary'
import { upload, ONE_MINUTE } from './upload'

export interface IndexTaskOutput {
    issueId: IssueCompositeKey
    message: string
    index: IssueSummary[]
}
export const handler: Handler<IndexTaskOutput> = async ({ issueId }) => {
    const index = await attempt(indexer())
    if (hasFailed(index)) {
        console.error(index)
        throw new Error('Could not generate index.')
    }
    await upload('issues', index, 'application/json', ONE_MINUTE)
    return {
        issueId,
        index,
        message: `Index regenerated`,
    }
}
