import { Edition, RegionalEdition } from 'src/common'
import moment, { Moment } from 'moment'
import { routeNames } from 'src/navigation/routes'

const nextSaturday = (locale: string): Moment => {
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
    } else {
        // otherwise, give me *next week's* instance of that same day
        return moment()
            .tz(locale)
            .add(1, 'weeks')
            .isoWeekday(requiredDay)
            .set('hour', 7)
            .set('minute', 0)
            .set('second', 0)
    }
}

// Having a consistent way to produce notification ids for identification purposes
const notificationId = (edition: Edition, date: Moment): string =>
    date.format('YYYYMMDD')

const notificationPayload = (
    defaultEdition: RegionalEdition,
    date: Moment,
) => ({
    id: notificationId(defaultEdition.edition, date),
    title: defaultEdition.title,
    message: `The latest edition of ${defaultEdition.title} is available`,
    date: date.toDate(),
    allowWhileIdle: true,
    userInfo: { route: routeNames.Issue, edition: defaultEdition.edition },
})

export { nextSaturday, notificationId, notificationPayload }
