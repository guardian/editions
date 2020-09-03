import PushNotification from 'react-native-push-notification'
import { getDefaultEdition } from 'src/hooks/use-edition-provider'
import moment, { Moment } from 'moment-timezone'
import { Edition } from 'src/common'
import { loggingService, Level } from 'src/services/logging'
import { notificationsAreEnabled } from 'src/hooks/use-config-provider'
import { notificationPayload, nextSaturday } from './local-notification-setup'

// Currently used for manual testing notifications
const localnotification = async (): Promise<void> => {
    const notificationsEnabled = await notificationsAreEnabled()
    if (notificationsEnabled) {
        PushNotification.localNotification({
            title: 'Good Morning!',
            message: 'This weekend’s edition is ready. Have a good one!',
        })
    }
}

const editionToMomentTimezone = new Map<Edition, string>()
editionToMomentTimezone.set('australian-edition', 'Australia/Sydney')

const scheduledLocalNotification = async (
    testOveride?: Moment,
): Promise<void> => {
    const notificationsEnabled = await notificationsAreEnabled()
    if (notificationsEnabled) {
        const defaultEdition = await getDefaultEdition()

        if (defaultEdition) {
            const editionTimezone = editionToMomentTimezone.get(
                defaultEdition.edition,
            )

            if (editionTimezone) {
                const date = testOveride || nextSaturday(editionTimezone)
                console.log(notificationPayload(defaultEdition, date))
                await PushNotification.localNotificationSchedule(
                    notificationPayload(defaultEdition, date),
                )
                loggingService.log({
                    message: `Notification Schdueled`,
                    level: Level.INFO,
                    optionalFields: {
                        notificationDate: date,
                        edition: defaultEdition.edition,
                    },
                })
            }
        }
    }
}

const cancelSheduledLocalNotifications = async (): Promise<void> => {
    await PushNotification.cancelAllLocalNotifications()
    loggingService.log({
        message: `Notifications Cancelled`,
        level: Level.INFO,
    })
}

export {
    cancelSheduledLocalNotifications,
    localnotification,
    scheduledLocalNotification,
}

/**
 * Test all the things that have changed
 * implement remote config so it can be turned off
 * Go to the Issues route
 */
