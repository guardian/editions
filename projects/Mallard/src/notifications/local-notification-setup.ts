import { Edition, RegionalEdition } from 'src/common'
import { Moment } from 'moment'
import { routeNames } from 'src/navigation/routes'

// Having a consistent way to produce notification ids should help with identifying them for cancellation
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

export { notificationId, notificationPayload }
