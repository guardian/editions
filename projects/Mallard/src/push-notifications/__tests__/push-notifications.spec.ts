import { maybeRegister } from '../push-notifications'
import {
    getMockAsyncCache,
    getMockPromise,
} from 'src/test-helpers/test-helpers'
import moment from 'moment'

const _today = moment()
const today = () => _today.clone()

describe('push-notifications', () => {
    describe('maybeRegister', () => {
        it('registers when there was not previous registration, and sets the cache', async () => {
            const registrationCache = getMockAsyncCache(null)
            const postNotification = getMockPromise({})
            expect(
                await maybeRegister(
                    'token',
                    registrationCache,
                    postNotification,
                    today().toISOString(),
                ),
            ).toBe(true)
            expect(postNotification).toBeCalled()
            expect(registrationCache.set).toHaveBeenCalledWith({
                token: 'token',
                registrationDate: today().toISOString(),
            })
        })

        it('does not reregister when there was a previous registration within 14 days in the cache and the tokens are the same', async () => {
            const registrationCache = getMockAsyncCache({
                token: 'token',
                registrationDate: today()
                    .subtract(14, 'days')
                    .toISOString(),
            })
            const postNotification = getMockPromise({})
            expect(
                await maybeRegister(
                    'token',
                    registrationCache,
                    postNotification,
                    today().toISOString(),
                ),
            ).toBe(false)
            expect(postNotification).not.toBeCalled()
            expect(registrationCache.set).not.toHaveBeenCalled()
        })

        it('does reregister when there was a previous registration within 14 days in the cache but the tokens are different', async () => {
            const registrationCache = getMockAsyncCache({
                token: 'different-token',
                registrationDate: today()
                    .subtract(14, 'days')
                    .toISOString(),
            })
            const postNotification = getMockPromise({})
            expect(
                await maybeRegister(
                    'token',
                    registrationCache,
                    postNotification,
                    today().toISOString(),
                ),
            ).toBe(true)
            expect(postNotification).toBeCalled()
            expect(registrationCache.set).toHaveBeenCalledWith({
                token: 'token',
                registrationDate: today().toISOString(),
            })
        })

        it('does reregister when there was a previous registration over 14 days in the cache and the tokens are the same', async () => {
            const registrationCache = getMockAsyncCache({
                token: 'token',
                registrationDate: today()
                    .subtract(15, 'days')
                    .toISOString(),
            })
            const postNotification = getMockPromise({})
            expect(
                await maybeRegister(
                    'token',
                    registrationCache,
                    postNotification,
                    today().toISOString(),
                ),
            ).toBe(true)
            expect(postNotification).toBeCalled()
            expect(registrationCache.set).toHaveBeenCalledWith({
                token: 'token',
                registrationDate: today().toISOString(),
            })
        })
    })
})
