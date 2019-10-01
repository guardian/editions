import { IssuePublicationIdentifier } from '../../common'
import { Status } from '../services/status'
import moment from 'moment'
import {
    sendPublishStatusToTopic,
    createPublishEvent,
} from './pub-status-notifier'
import { Handler } from 'aws-lambda'
import { logInput, logOutput } from '../utils/log'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const errorToString = (err: any): string => {
    if (err instanceof Error) {
        return err.toString()
    }
    return `Error: ${JSON.stringify(err)}`
}

type InputWithIdentifier = { issuePublication: IssuePublicationIdentifier }

function handleAndNotifyInternal<I extends InputWithIdentifier, O>(
    statusOnSuccess: Status | undefined,
    handler: (input: I) => Promise<O>,
): Handler<I, O> {
    return async (input: I) => {
        try {
            logInput(input)
            const result = await handler(input)
            logOutput(result)
            if (statusOnSuccess) {
                const now = moment()
                const event = createPublishEvent(
                    input.issuePublication,
                    statusOnSuccess,
                    now,
                )
                await sendPublishStatusToTopic(event)
            }
            return result
        } catch (err) {
            // send failure notification
            await sendPublishStatusToTopic({
                ...input.issuePublication,
                status: 'Failed',
                message: errorToString(err),
                timestamp: moment().format(),
            })
            // now escalate error
            throw err
        }
    }
}

export function handleAndNotify<I extends InputWithIdentifier, O>(
    statusOnSuccess: Status,
    handler: (input: I) => Promise<O>,
): Handler<I, O> {
    return handleAndNotifyInternal(statusOnSuccess, handler)
}

export function handleAndNotifyOnError<I extends InputWithIdentifier, O>(
    handler: (input: I) => Promise<O>,
): Handler<I, O> {
    return handleAndNotifyInternal(undefined, handler)
}
