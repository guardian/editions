import { IssueParams } from './issueTask'
import { Handler } from 'aws-lambda'
import uuid5 from 'uuid/v5'
import fetch from 'node-fetch'

export const handler: Handler<IssueParams, IssueParams> = async ({
    issueId,
}) => {
    const endpoint = process.env.endpoint
    const key = process.env.key

    if (endpoint == null || key == null) {
        throw new Error('Key or endpoint not defined')
    }
    const uuid = uuid5('notification', 'com.gu.editions')

    const message = {
        id: uuid,
        type: 'editions',
        topic: [{ type: 'editions', name: 'uk' }],
        key: issueId.id,
        name: 'Daily Edition',
        date: issueId.id,
        sender: 'lambda',
    }
    fetch(endpoint, {
        method: 'post',
        body: JSON.stringify(message),
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key}`,
        },
    })
    return { issueId }
}
