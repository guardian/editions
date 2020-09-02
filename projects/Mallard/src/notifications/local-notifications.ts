import PushNotification from 'react-native-push-notification'
import { getDefaultEdition } from 'src/hooks/use-edition-provider'
import moment from 'moment-timezone'
import { Edition } from 'src/common'
import { loggingService, Level } from 'src/services/logging'

// Currently used for testing notifications
const localnotification = (notificationsEnabled: boolean) => {
    if (notificationsEnabled) {
        PushNotification.localNotification({
            title: 'Good Morning!',
            message: 'This weekend’s edition is ready. Have a good one!',
        })
    }
}

const nextSaturday = (locale: string) => {
    const requiredDay = 6
    const today = moment()
        .tz(locale)
        .isoWeekday()

    // if we haven't yet passed the day of the week that we need:
    if (today <= requiredDay) {
        // then just give me this week's instance of that day
        return moment()
            .tz(locale)
            .isoWeekday(requiredDay)
            .set('hour', 7)
            .set('minute', 0)
            .set('second', 0)
            .toDate()
    } else {
        // otherwise, give me *next week's* instance of that same day
        return moment()
            .tz(locale)
            .add(1, 'weeks')
            .isoWeekday(requiredDay)
            .set('hour', 7)
            .set('minute', 0)
            .set('second', 0)
            .toDate()
    }
}

const editionToMomentTimezone = new Map<Edition, string>()
editionToMomentTimezone.set('australian-edition', 'Australia/Sydney')

const scheduledLocalNotification = async (notificationsEnabled: boolean) => {
    if (notificationsEnabled) {
        const defaultEdition = await getDefaultEdition()

        if (defaultEdition) {
            const editionTimezone = editionToMomentTimezone.get(
                defaultEdition.edition,
            )

            if (editionTimezone) {
                // As it stands, this means we only set AUS
                const date = nextSaturday(editionTimezone)

                PushNotification.localNotificationSchedule({
                    title: defaultEdition.title,
                    message: `The latest edition of ${defaultEdition.title} is available`,
                    date,
                })
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

export { localnotification, scheduledLocalNotification }

/**
 *
 * implement remote config so it can be turned off
 * update what happens when a user clicks. Needs a payload. When clicked send a log or Ophan event
 * delete scheduled notifications and add new one when change edition
 */
