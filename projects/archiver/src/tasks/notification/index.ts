import { Handler } from 'aws-lambda'
import { handleAndNotify } from '../../services/task-handler'
import {
    scheduleDeviceNotificationIfEligible,
    NotificationStatus,
} from './helpers/device-notifications'
import { IndexTaskOutput } from '../indexer'
import { IssuePublicationIdentifier } from '../../../common'
import { getBucket } from '../../utils/s3'
import { sleep } from '../../utils/sleep'

export type NotificationTaskInput = IndexTaskOutput
export interface NotificationTaskOutput {
    issuePublication: IssuePublicationIdentifier
    notificationStatus: NotificationStatus
}

const Bucket = getBucket('publish')

export const handler: Handler<
    NotificationTaskInput,
    NotificationTaskOutput
> = handleAndNotify(
    'notified',
    async ({ issuePublication, issue }) => {
        console.log(`Scheduling notification for ${issue.name}, ${issue.date}`)
        await sleep(1000)

        const stage: string = process.env.stage || 'code'

        const {
            issueDate,
            edition,
            notificationUTCOffset,
            topic,
        } = issuePublication
        const { key, name } = issue

        const guNotificationServiceDomain =
            stage.toLowerCase() == 'prod'
                ? 'https://notification.notifications.guardianapis.com'
                : 'https://notification.notifications.code.dev-guardianapis.com'

        const guNotificationServiceAPIKey =
            process.env.gu_notify_service_api_key || ''
        const notificationStatus = await scheduleDeviceNotificationIfEligible(
            { key, name, issueDate, edition, notificationUTCOffset, topic },
            {
                domain: guNotificationServiceDomain,
                apiKey: guNotificationServiceAPIKey,
            },
        )

        return { issuePublication, notificationStatus }
    },
    Bucket,
)
