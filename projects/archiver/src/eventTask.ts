import { IssueId } from './issueTask'

import { Handler } from 'aws-lambda'
import {
    SNS,
    ChainableTemporaryCredentials,
    TemporaryCredentials,
} from 'aws-sdk'
export type status = 'Processing' | 'Published' | 'Failed'

export interface EventInput {
    issueId: IssueId
    message?: string
}

export const handler: Handler<EventInput, { issueId: IssueId }> = async ({
    issueId,
    message,
}) => {
    const topic = process.env.topic
    const role = process.env.role
    if (topic === undefined || role === undefined) {
        throw new Error('No topic or role.')
    }
    console.log(topic, role)
    console.log('hello')
    const sns = new SNS({
        region: 'eu-west-1',
        credentials: new TemporaryCredentials({
            RoleArn: role,
            RoleSessionName: 'front-assume-role-access-for-sns',
        }),
    })
    const payload = {
        event: {
            issueDate: issueId.id,
            version: issueId.source,
            status: 'Published',
            message,
        },
    }
    const send = await sns
        .publish({ TopicArn: topic, Message: JSON.stringify(payload) })
        .promise()
    console.log(send)
    return { issueId }
}
