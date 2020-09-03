import {
    notificationId,
    notificationPayload,
} from '../local-notification-setup'
import moment from 'moment'
import { regionalEdition } from './__fixtures__/regional-edition'

describe('Local Notification Setup', () => {
    describe('notificationId', () => {
        it('should return the notification in a {YYYYMMDD} format', () => {
            const id = notificationId(
                'australian-edition',
                moment('2020-09-02T13:57:03.896Z'),
            )
            expect(id).toEqual('20200902')
        })
    })

    describe('notificationPayload', () => {
        it('should deliver a matching notification payload', () => {
            const payload = notificationPayload(
                regionalEdition,
                moment('2020-09-02T13:57:03.896Z'),
            )
            expect(payload).toMatchSnapshot()
        })
    })
})
