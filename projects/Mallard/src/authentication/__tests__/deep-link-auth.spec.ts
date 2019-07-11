import { authWithDeepRedirect } from '../deep-link-auth'
import { EventEmitter } from 'events'

const createListener = (): EventEmitter & {
    addEventListener: EventEmitter['addListener']
    removeEventListener: EventEmitter['removeListener']
} => {
    const ee: any = new EventEmitter()
    ee.addEventListener = ee.addListener
    ee.removeEventListener = ee.removeListener
    return ee
}

describe('deep-link-auth', () => {
    describe('authWithDeepRedirect', () => {
        it('waits for a deep link with a token before resolving', async () => {
            const linking = Object.assign(createListener(), {
                openURL: () => {},
            })
            const appState = createListener()
            const validator = jest.fn(async () => 'token')

            const promise = authWithDeepRedirect(
                'https://authurl.com/auth',
                validator,
                linking,
                appState,
            )

            linking.emit('url', { url: 'myurl' })

            const val = await promise

            expect(val).toBe('token')
            expect(validator).toBeCalledWith('myurl')
        })

        it('will throw if the app is opened without a deep link', async () => {
            const linking = Object.assign(createListener(), {
                openURL: () => {},
            })
            const appState = createListener()
            const validator = jest.fn(async () => 'token')

            const promise = authWithDeepRedirect(
                'https://authurl.com/auth',
                validator,
                linking,
                appState,
            )

            let error

            // there's probably a better way to do this with jest!
            try {
                appState.emit('change', 'active')
                await promise
            } catch (e) {
                error = e
            }

            await expect(error).toBe('Login cancelled')
        })

        it('will throw if the validator throws', async () => {
            const linking = Object.assign(createListener(), {
                openURL: () => {},
            })
            const appState = createListener()
            const validator = jest.fn(async () => {
                throw 'hi'
            })

            const promise = authWithDeepRedirect(
                'https://authurl.com/auth',
                validator,
                linking,
                appState,
            )

            let error

            try {
                linking.emit('url', { url: 'myurl' })
                await promise
            } catch (e) {
                error = e
            }

            await expect(error).toBe('hi')
        })
    })
})
