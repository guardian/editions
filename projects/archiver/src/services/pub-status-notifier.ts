import { attempt } from '../../../backend/utils/try'
import { TemporaryCredentials, SNS } from 'aws-sdk'
import { IssuePublicationIdentifier, Edition } from '../../common'
import { Status } from './status'
import { Moment } from 'moment'

export type ToolStatus =
    | 'Proofing'
    | 'Proofed'
    | 'Publishing'
    | 'Published'
    | 'Failed'
    | 'Processing'

export interface PublishEvent {
    edition: Edition
    issueDate: string
    version: string
    status: ToolStatus
    message: string
    timestamp: string
}

export const sendPublishStatusToTopic = async (pubEvent: PublishEvent) => {
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
    console.log(`SNS publish response: ${JSON.stringify(sendStatus)}`)
    return sendStatus
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function throwBadStatus(s: never): never {
    throw new Error('Unknown status type')
}

export const createPublishEvent = (
    identifier: IssuePublicationIdentifier,
    status: Status,
    eventTime: Moment,
): PublishEvent => {
    const timestamp = eventTime.format()
    switch (status) {
        case 'started':
        case 'assembled':
        case 'bundled':
            return {
                ...identifier,
                status: 'Proofing',
                message: `Proof stage: ${status}`,
                timestamp,
            }
        case 'proofed':
            return {
                ...identifier,
                status: 'Proofed',
                message: `Ready for proofing on-device`,
                timestamp,
            }
        case 'copied':
            return {
                ...identifier,
                status: 'Publishing',
                message: `Publication stage: ${status}`,
                timestamp,
            }
        case 'published':
            return {
                ...identifier,
                status: 'Published',
                message: `Publication stage: ${status}`,
                timestamp,
            }
        case 'notified':
            return {
                ...identifier,
                status: 'Published',
                message: 'Publication processing complete',
                timestamp,
            }
        case 'editionsListUpdated':
            return {
                ...identifier,
                status: 'Processing',
                message: `Publication stage: ${status}`,
                timestamp,
            }
        case 'errored':
            throw new Error('Can\'t make publish event with status "errored"')
        default:
            return throwBadStatus(status)
    }
}
