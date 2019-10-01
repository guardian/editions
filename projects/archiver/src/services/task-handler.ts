import { IssuePublicationIdentifier } from '../../common'
import { Status } from '../services/status'
import moment from 'moment'
import {
    sendPublishStatusToTopic,
    createPublishEvent,
} from './pub-status-notifier'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const errorToString = (err: any): string => {
    if (err instanceof Error) {
        return err.toString()
    }
    return `Error: ${JSON.stringify(err)}`
}

async function handleAndNotifyInternal<T>(
    identifier: IssuePublicationIdentifier,
    statusOnSuccess: Status | undefined,
    handler: () => Promise<T>,
): Promise<T> {
    try {
        const result = await handler()
        if (statusOnSuccess) {
            const now = moment()
            const event = createPublishEvent(identifier, statusOnSuccess, now)
            await sendPublishStatusToTopic(event)
        }
        return result
    } catch (err) {
        // send failure notification
        await sendPublishStatusToTopic({
            ...identifier,
            status: 'Failed',
            message: errorToString(err),
            timestamp: moment().format(),
        })
        // now escalate error
        throw err
    }
}

export async function handleAndNotify<T>(
    identifier: IssuePublicationIdentifier,
    statusOnSuccess: Status,
    handler: () => Promise<T>,
): Promise<T> {
    return await handleAndNotifyInternal(identifier, statusOnSuccess, handler)
}

export async function handleAndNotifyOnError<T>(
    identifier: IssuePublicationIdentifier,
    handler: () => Promise<T>,
): Promise<T> {
    return await handleAndNotifyInternal(identifier, undefined, handler)
}
