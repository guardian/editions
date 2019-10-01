import { Handler } from 'aws-lambda'
import { IssueCompositeKey, IssuePublicationIdentifier, Issue } from '../common'
import { logInput, logOutput } from './log-utils'
import { handleAndNotify } from './notifications/pub-status-notifier'
import { scheduleDeviceNotificationIfInFuture } from './notifications/device-notifications'

export interface EventTaskInput {
    issuePublication: IssuePublicationIdentifier
    issue: Issue
}

export interface EventTaskOutput {
    issueId: IssueCompositeKey
}

export const handler: Handler<EventTaskInput, EventTaskOutput> = async ({
    issuePublication,
    issue,
}) => {
    return handleAndNotify<EventTaskOutput>(
        issuePublication,
        'notified',
        async () => {
            const eventTaskInput = {
                issuePublication,
                issue,
            }

            logInput(eventTaskInput)

            const stage: string = process.env.stage || 'code'

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
        },
    )
}
