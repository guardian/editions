import { Edition, RegionalEdition } from 'src/common'
import { Moment } from 'moment'

// Having a consistent way to produce notification ids should help with identifying them for cancellation
const notificationId = (edition: Edition, date: Moment): string =>
    `${edition}-${date.format('YYYY-MM-DD')}`

const notificationPayload = (
    defaultEdition: RegionalEdition,
    date: Moment,
) => ({
    id: notificationId(defaultEdition.edition, date),
    title: defaultEdition.title,
    message: `The latest edition of ${defaultEdition.title} is available`,
    date: date.toDate(),
})

export { notificationId, notificationPayload }
