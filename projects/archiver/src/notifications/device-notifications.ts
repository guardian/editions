import { IssuePublicationIdentifier, Issue } from '../../common'

interface Topic {
    type: string
    name: string
}

interface ScheduleAppStoreNotificationPayload {
    id: string
    type: string
    topic: Topic[]
    key: string
    name: string
    date: string
    sender: string
}

export const scheduleAppStoreNotification = (
    issue: Issue,
    issuePublication: IssuePublicationIdentifier,
): any => {
    console.log('scheduling App Store Notification')
    const { issueDate } = issuePublication
    const { key, name } = issue

    const issueAppStoreNotification: ScheduleAppStoreNotificationPayload = {
        id: '123',
        type: 'editions',
        topic: [{ type: 'editions', name: 'uk' }],
        key,
        name,
        date: issueDate,
        sender: 'editions-backend',
    }

    console.log(
        'issue app store notification payload',
        issueAppStoreNotification,
    )
}
