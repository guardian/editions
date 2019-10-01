import { Handler } from 'aws-lambda'
import { IssueCompositeKey, IssuePublicationIdentifier, Issue } from '../common'
import { logInput, logOutput } from './log-utils'
import {
    PublishEvent,
    Status,
    notifyAboutPublishStatus,
} from './notifications/pub-status-notifyer'
import { scheduleDeviceNotificationIfInFuture } from './notifications/device-notifications'

const extractError = (error?: { Cause: string }): string | undefined => {
    if (error === undefined) {
        return
    }
    try {
        const parsed = JSON.parse(error.Cause)
        return parsed.errorMessage || error.Cause
    } catch {
        return error.Cause
    }
}

export interface EventTaskInput {
    issuePublication: IssuePublicationIdentifier
    issue: Issue
    message?: string
    error?: {
        Error: string
        Cause: string
    }
}

export interface EventTaskOutput {
    issueId: IssueCompositeKey
}

export const handler: Handler<EventTaskInput, EventTaskOutput> = async ({
    issuePublication,
    issue,
    message,
    error,
}) => {
    const eventTaskInput = {
        issuePublication,
        issue,
        message,
    }

    logInput(eventTaskInput)

    const stage: string = process.env.stage || 'code'

    const status: Status = error === undefined ? 'Published' : 'Failed'
    const messageOrError = extractError(error) || message
    const { version } = issuePublication
    const publishEvent: PublishEvent = {
        version,
        status,
        message: messageOrError,
    }

    const sendSNSRes = await notifyAboutPublishStatus(publishEvent)
    console.log('send sns message:', sendSNSRes)

    const { issueDate } = issuePublication
    const { key, name } = issue

    const guNotificationServiceDomain =
        stage.toLowerCase() == 'prod'
            ? 'https://notification.notifications.guardianapis.com'
            : 'https://notification.notifications.code.dev-guardianapis.com'

    const guNotificationServiceAPIKey =
        process.env.gu_notify_service_api_key || ''

    await scheduleDeviceNotificationIfInFuture(
        { key, name, issueDate },
        {
            domain: guNotificationServiceDomain,
            apiKey: guNotificationServiceAPIKey,
        },
    )

    const { publishedId, localId } = issue

    const issueId: IssueCompositeKey = {
        publishedId,
        localId,
    }
    const out: EventTaskOutput = { issueId }
    logOutput(out)
    return out
}
