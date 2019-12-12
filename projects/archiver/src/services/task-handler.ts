import { IssuePublicationIdentifier } from '../../common'
import { Status, putStatus } from './status'
import moment, { Moment } from 'moment'
import {
    sendPublishStatusToTopic,
    createPublishEvent,
    PublishEvent,
} from './pub-status-notifier'
import { Handler } from 'aws-lambda'
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

export type HandlerDependencies = {
    putStatus: (
        issuePublication: IssuePublicationIdentifier,
        status: Status,
        Bucket: string,
    ) => Promise<{ etag: string }>
    sendPublishStatusToTopic: (
        event: PublishEvent,
    ) => Promise<Attempt<PromiseResult<SNS.PublishResponse, AWSError>>>
    getMoment: () => Moment
}

export function handleAndNotifyInternal<I extends InputWithIdentifier, O>(
    statusOnSuccess: Status,
    handler: (input: I) => Promise<O>,
    dependencies: HandlerDependencies,
    Bucket: string,
): Handler<I, O> {
    return async (input: I) => {
        const { issuePublication } = input
        try {
            console.log('input:', JSON.stringify(input))
            const result = await handler(input)
            console.log('output:', JSON.stringify(result))
            if (statusOnSuccess != 'errored') {
                await dependencies.putStatus(
                    issuePublication,
                    statusOnSuccess,
                    Bucket,
                )
                const event = createPublishEvent(
                    issuePublication,
                    statusOnSuccess,
                    dependencies.getMoment(),
                )
                await dependencies.sendPublishStatusToTopic(event)
            }
            return result
        } catch (err) {
            // send failure notification
            const event: PublishEvent = {
                ...issuePublication,
                status: 'Failed',
                message: errorToString(err),
                timestamp: dependencies.getMoment().format(),
            }
            await dependencies.sendPublishStatusToTopic(event)
            // now escalate error
            throw err
        }
    }
}

const runtimeHandlerDependencies = {
    putStatus,
    sendPublishStatusToTopic,
    getMoment: () => moment(),
}

/* This is a general handler that handles logging of input and output objects
 * and also notifications to the tooling topic on both success and failure
 */
export function handleAndNotify<I extends InputWithIdentifier, O>(
    statusOnSuccess: Status,
    handler: (input: I) => Promise<O>,
    Bucket: string,
): Handler<I, O> {
    return handleAndNotifyInternal(
        statusOnSuccess,
        handler,
        runtimeHandlerDependencies,
        Bucket,
    )
}

/* This is a general handler that handles logging of input and output objects
 * and also notifications to the tooling topic on failures
 */
export function handleAndNotifyOnError<I extends InputWithIdentifier, O>(
    handler: (input: I) => Promise<O>,
    Bucket: string,
): Handler<I, O> {
    return handleAndNotifyInternal(
        'errored',
        handler,
        runtimeHandlerDependencies,
        Bucket,
    )
}
