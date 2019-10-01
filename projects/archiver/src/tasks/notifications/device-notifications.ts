import { attempt } from '../../../../backend/utils/try'
import fetch from 'node-fetch'
import {
    prepareScheduleDeviceNotificationRequest,
    createScheduleTime,
    shouldSchedule,
} from './device-notifications-helpers'

/**
 * TODO
 * it will work now noly for Daily Editions in UK
 * In the future we will need to make it more generic (for US and Australia)
 **/

export interface IssueNotificationData {
    key: string
    name: string
    issueDate: string
}

const scheduleDeviceNotification = async (
    issueData: IssueNotificationData,
    cfg: { domain: string; apiKey: string },
    scheduleTime: string,
) => {
    const { reqEndpoint, reqBody } = prepareScheduleDeviceNotificationRequest(
        issueData,
        cfg,
        scheduleTime,
    )
    const rawResponse = await fetch(reqEndpoint, reqBody)
    const { status, statusText } = rawResponse

    if (status < 200 || status > 299) {
        const resText = await attempt(rawResponse.text())
        const errLog = `Could not Schedule Device Notification, status: ${status}, statusText: ${statusText}, error message: ${resText}`
        console.error(errLog)
        throw new Error(errLog)
    }
    return { statusCode: status, statusText }
}

export const scheduleDeviceNotificationIfInFuture = async (
    issueData: IssueNotificationData,
    cfg: { domain: string; apiKey: string },
) => {
    const scheduleTime = createScheduleTime(issueData.issueDate)

    const now = new Date()

    if (shouldSchedule(scheduleTime, now)) {
        const { statusCode, statusText } = await scheduleDeviceNotification(
            issueData,
            cfg,
            scheduleTime,
        )

        console.log(
            'schedule Device Notification Response',
            JSON.stringify({
                statusCode: statusCode,
                statusText: statusText,
            }),
        )
    } else {
        console.log(
            `skipping schedule Device Notification because the (scheduleTime: ${scheduleTime}) is in the past`,
        )
    }
}
