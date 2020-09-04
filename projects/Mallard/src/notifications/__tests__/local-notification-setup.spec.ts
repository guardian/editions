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

    describe('nextSaturday', () => {
        it('should give us the saturday next week if we are on Sunday')
        it(
            'should give us staturday next week if we are on saturday after 6am local time',
        )
        it('should give us this saturday if we are on a day before saturday')
        it('should give us today if we are on saturday before 6am local time')
    })
})
