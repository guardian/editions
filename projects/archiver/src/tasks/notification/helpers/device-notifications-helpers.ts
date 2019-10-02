import moment from 'moment'
import uuid from 'uuidv4'
import { IssueNotificationData } from './device-notifications'
import { RequestInit, RequestInfo } from 'node-fetch'

type EditionNotificationTypes = 'editions'

type NotificationSenders = 'editions-backend'

interface EditionTopic {
    type: EditionNotificationTypes
    name: string
}

interface ScheduleDeviceNotificationPayload {
    id: string
    type: EditionNotificationTypes
    topic: EditionTopic[]
    key: string
    name: string
    date: string
    sender: NotificationSenders
}

const createScheduleNotificationEndpoint = (
    domain: string,
    scheduleTime: string,
) => {
    return `${domain}/push/schedule/${scheduleTime}`
}

/**
 * TODO
 * it will work now only for Daily Editions in UK
 * In the future we will need to make it more generic (for US and Australia)
 **/
export const createScheduleTime = (issueDate: string): string => {
    const THREE_AT_NIGHT = 'T03:00:00Z'
    return `${issueDate}${THREE_AT_NIGHT}`
}

export const shouldSchedule = (scheduleTime: string, now: Date): boolean => {
    if (!moment(now).isValid()) {
        throw new Error(`given Date now: ${now} is invalid`)
    }
    const scheduleDate = moment(scheduleTime)
    if (!scheduleDate.isValid()) {
        throw new Error(`given Date scheduleTime: ${scheduleTime} is invalid`)
    }
    return scheduleDate.isAfter(now)
}

export const prepareScheduleDeviceNotificationRequest = (
    issueData: IssueNotificationData,
    cfg: { domain: string; apiKey: string },
    scheduleTime: string,
): { reqEndpoint: RequestInfo; reqBody: RequestInit } => {
    const { domain, apiKey } = cfg

    const { key, name, issueDate } = issueData

    /**
     * TODO
     * Payload is hardcoded now for UK
     * In the future we will need to make it more generic (for US and Australia)
     */
    const payload: ScheduleDeviceNotificationPayload = {
        id: uuid.fromString(key),
        type: 'editions',
        topic: [{ type: 'editions', name: 'uk' }],
        key,
        name,
        date: issueDate,
        sender: 'editions-backend',
    }

    const reqBody: RequestInit = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    }

    const reqEndpoint = createScheduleNotificationEndpoint(domain, scheduleTime)

    console.log('Device notification endpoint:', reqEndpoint)
    console.log('Issue device notification payload', JSON.stringify(payload))

    return {
        reqEndpoint,
        reqBody,
    }
}
