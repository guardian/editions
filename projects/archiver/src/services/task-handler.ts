import { IssuePublicationIdentifier } from '../../common'
import { Status, putStatus } from '../services/status'
import moment from 'moment'
import {
    sendPublishStatusToTopic,
    createPublishEvent,
    PublishEvent,
} from './pub-status-notifier'
import { Handler } from 'aws-lambda'
import { logInput, logOutput } from '../utils/log'
import { Attempt } from '../../../backend/utils/try'
import { PromiseResult } from 'aws-sdk/lib/request'
import SNS from 'aws-sdk/clients/sns'
import { AWSError } from 'aws-sdk'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const errorToString = (err: any): string => {
    if (err instanceof Error) {
        return err.toString()
    }
    return `Error: ${JSON.stringify(err)}`
}

type InputWithIdentifier = { issuePublication: IssuePublicationIdentifier }

type HandlerDependencies = {
    putStatus: (
        issuePublication: IssuePublicationIdentifier,
        status: Status,
    ) => Promise<{ etag: string }>
    sendPublishStatusToTopic: (
        event: PublishEvent,
    ) => Promise<Attempt<PromiseResult<SNS.PublishResponse, AWSError>>>
}

function handleAndNotifyInternal<I extends InputWithIdentifier, O>(
    statusOnSuccess: Status | undefined,
    handler: (input: I) => Promise<O>,
    dependencies: HandlerDependencies,
): Handler<I, O> {
    return async (input: I) => {
        try {
            logInput(input)
            const result = await handler(input)
            logOutput(result)
            if (statusOnSuccess) {
                await dependencies.putStatus(
                    input.issuePublication,
                    statusOnSuccess,
                )
                const now = moment()
                const event = createPublishEvent(
                    input.issuePublication,
                    statusOnSuccess,
                    now,
                )
                await dependencies.sendPublishStatusToTopic(event)
            }
            return result
        } catch (err) {
            // send failure notification
            await dependencies.sendPublishStatusToTopic({
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

const runtimeHandlerDependencies = { putStatus, sendPublishStatusToTopic }

/* This is a general handler that handles logging of input and output objects
 * and also notifications to the tooling topic on both success and failure
 */
export function handleAndNotify<I extends InputWithIdentifier, O>(
    statusOnSuccess: Status,
    handler: (input: I) => Promise<O>,
): Handler<I, O> {
    return handleAndNotifyInternal(
        statusOnSuccess,
        handler,
        runtimeHandlerDependencies,
    )
}

/* This is a general handler that handles logging of input and output objects
 * and also notifications to the tooling topic on failures
 */
export function handleAndNotifyOnError<I extends InputWithIdentifier, O>(
    handler: (input: I) => Promise<O>,
): Handler<I, O> {
    return handleAndNotifyInternal(
        undefined,
        handler,
        runtimeHandlerDependencies,
    )
}
