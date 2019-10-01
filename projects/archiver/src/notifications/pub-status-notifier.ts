import { attempt } from '../../../backend/utils/try'
import { TemporaryCredentials, SNS } from 'aws-sdk'
import { IssuePublicationIdentifier } from '../../common'
import { Status } from '../status'

export type ToolStatus = 'Processing' | 'Published' | 'Failed'

export interface PublishEvent {
    edition: string
    issueDate: string
    version: string
    status: ToolStatus
    message: string
}

export const notifyAboutPublishStatus = async (pubEvent: PublishEvent) => {
    console.log('attempt to send publish status update', pubEvent)
    const payload = { event: pubEvent }
    const topic = process.env.topic
    const role = process.env.role
    if (topic === undefined || role === undefined) {
        throw new Error('No topic or role.')
    }
    const sns = new SNS({
        region: 'eu-west-1',
        credentials: new TemporaryCredentials({
            RoleArn: role,
            RoleSessionName: 'front-assume-role-access-for-sns',
        }),
    })
    const sendStatus = await attempt(
        sns
            .publish({ TopicArn: topic, Message: JSON.stringify(payload) })
            .promise(),
    )
    return sendStatus
}

async function handleAndNotifyInternal<T>(
    identifier: IssuePublicationIdentifier,
    statusOnSuccess: Status | undefined,
    handler: () => Promise<T>,
): Promise<T> {
    try {
        const result = await handler()
        if (statusOnSuccess) {
            await notifyAboutPublishStatus({
                ...identifier,
                status: statusOnSuccess,
            })
        }
        return result
    } catch (err) {
        // send failure notification
        await notifyAboutPublishStatus({
            ...identifier,
            status: 'aborted',
            message: err,
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
