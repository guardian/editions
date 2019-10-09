import { attempt } from '../../../../../backend/utils/try'
import fetch from 'node-fetch'
import {
    prepareScheduleDeviceNotificationRequest,
    createScheduleTime,
    shouldSchedule,
} from './device-notifications-helpers'

export interface IssueNotificationData {
    key: string
    name: string
    issueDate: string
    edition: string
}

export interface ScheduleDeviceNotificationAPIResponse {
    statusCode: number
    statusText: string
}

export interface ApiConfig {
    domain: string
    apiKey: string
}

export interface ScheduleDeviceNotificationInput {
    issueData: IssueNotificationData
    cfg: ApiConfig
    scheduleTime: string
}

const scheduleDeviceNotification = async (
    input: ScheduleDeviceNotificationInput,
): Promise<ScheduleDeviceNotificationAPIResponse> => {
    const { issueData, cfg, scheduleTime } = input
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

export type NotificationStatus = 'skipped' | 'scheduled'

export interface ScheduleDeviceNotificationDependencies {
    scheduleNotificationFunction: (
        input: ScheduleDeviceNotificationInput,
    ) => Promise<ScheduleDeviceNotificationAPIResponse>
}

export const scheduleDeviceNotificationIfEligibleInternal = async (
    issueData: IssueNotificationData,
    cfg: ApiConfig,
    now: Date,
    deps: ScheduleDeviceNotificationDependencies,
): Promise<NotificationStatus> => {
    const { edition } = issueData

    if (edition != 'daily-edition') {
        console.log(
            `skipping schedule Device Notification because the ${edition} edition is not eligible for Device Notification`,
        )
        return 'skipped'
    }

    const scheduleTime = createScheduleTime(issueData.issueDate)

    if (!shouldSchedule(scheduleTime, now)) {
        console.log(
            `skipping schedule Device Notification because the (scheduleTime: ${scheduleTime}) is in the past`,
        )
        return 'skipped'
    }

    const scheduleNotificationInput = {
        issueData,
        cfg,
        scheduleTime,
    }

    const { statusCode, statusText } = await deps.scheduleNotificationFunction(
        scheduleNotificationInput,
    )

    console.log(
        'schedule Device Notification Response',
        JSON.stringify({
            statusCode: statusCode,
            statusText: statusText,
        }),
    )

    return 'scheduled'
}

export const scheduleDeviceNotificationIfEligible = async (
    issueData: IssueNotificationData,
    cfg: ApiConfig,
): Promise<NotificationStatus> => {
    const runtimeDependencies = {
        scheduleNotificationFunction: scheduleDeviceNotification,
    }

    const now = new Date()

    return scheduleDeviceNotificationIfEligibleInternal(
        issueData,
        cfg,
        now,
        runtimeDependencies,
    )
}
