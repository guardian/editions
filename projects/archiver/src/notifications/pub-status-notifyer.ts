import { attempt } from '../../../backend/utils/try'
import { TemporaryCredentials, SNS } from 'aws-sdk'

export type Status = 'Processing' | 'Published' | 'Failed'

export interface PublishEvent {
    version: string
    status: Status
    message?: string
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
