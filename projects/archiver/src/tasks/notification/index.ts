import { Handler } from 'aws-lambda'
import { handleAndNotify } from '../../services/task-handler'
import { scheduleDeviceNotificationIfInFuture } from './helpers/device-notifications'
import { IndexTaskOutput } from '../indexer'
import { IssuePublicationIdentifier } from '../../../common'

export type NotificationTaskInput = IndexTaskOutput
export interface NotificationTaskOutput {
    issuePublication: IssuePublicationIdentifier
}

export const handler: Handler<
    NotificationTaskInput,
    NotificationTaskOutput
> = handleAndNotify('notified', async ({ issuePublication, issue }) => {
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

    return { issuePublication }
})
