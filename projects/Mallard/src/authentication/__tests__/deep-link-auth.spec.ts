import { authWithDeepRedirect } from '../deep-link-auth'
import { EventEmitter } from 'events'
import { BrowserResult } from 'react-native-inappbrowser-reborn'

const createListener = (): EventEmitter & {
    addEventListener: EventEmitter['addListener']
    removeEventListener: EventEmitter['removeListener']
} => {
    const ee: any = new EventEmitter()
    ee.addEventListener = ee.addListener
    ee.removeEventListener = ee.removeListener
    return ee
}

const createInAppBrowser = ({
    available = true,
    resultType,
}: {
    available?: boolean
    resultType?: 'cancel' | 'dismiss'
} = {}) => ({
    open: () =>
        new Promise<BrowserResult>(
            res => resultType && res({ type: resultType }),
        ),
    close: jest.fn(() => {}),
    isAvailable: () => Promise.resolve(available),
})

describe('deep-link-auth', () => {
    describe('authWithDeepRedirect', () => {
        describe('external link', () => {
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
                    createInAppBrowser({ available: false }),
                )

                linking.emit('url', { url: 'myurl' })

                const val = await promise

                expect(val).toBe('token')
                expect(validator).toBeCalledWith('myurl')
            })

            it('will throw if the app is foregrounded without a deep link', async () => {
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
                    createInAppBrowser({ available: false }),
                )

                // wait the in app browser check
                await Promise.resolve()

                let error

                // there's probably a better way to do this with jest!
                try {
                    appState.emit('change', 'active')
                    // this should not be able to save us, the error should already be fired
                    linking.emit('url', { url: 'myurl' })
                    await promise
                } catch (e) {
                    error = e
                }

                expect(error).toBe('Sign-in cancelled')
            })

            it('ignores the app being backgrounded and continues to wait for a deep link with a token before resolving', async () => {
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
                    createInAppBrowser({ available: false }),
                )

                appState.emit('change', 'inactive')
                linking.emit('url', { url: 'myurl' })

                const val = await promise

                expect(val).toBe('token')
                expect(validator).toBeCalledWith('myurl')
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
                    createInAppBrowser({ available: false }),
                )

                // wait the in app browser check
                await Promise.resolve()

                let error

                try {
                    linking.emit('url', { url: 'myurl' })
                    await promise
                } catch (e) {
                    error = e
                }

                expect(error).toBe('hi')
            })
        })

        describe('in app browser', () => {
            it('waits for a deep link with a token before resolving, and then closes browser', async () => {
                const linking = Object.assign(createListener(), {
                    openURL: () => {},
                })
                const appState = createListener()
                const validator = jest.fn(async () => 'token')
                const browser = createInAppBrowser({ available: true })

                const promise = authWithDeepRedirect(
                    'https://authurl.com/auth',
                    validator,
                    linking,
                    appState,
                    browser,
                )

                linking.emit('url', { url: 'myurl' })

                const val = await promise

                expect(val).toBe('token')
                expect(validator).toBeCalledWith('myurl')
                expect(browser.close).toBeCalled()
            })

            it('will not throw if the app is foregrounded without a deep link but will wait for link emit', async () => {
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
                    createInAppBrowser({ available: true }),
                )

                // wait the in app browser check
                await Promise.resolve()

                let error

                try {
                    // fire this first, which would ordinarly trigger an error without an
                    // in app browser
                    appState.emit('change', 'active')
                    linking.emit('url', { url: 'myurl' })
                    await promise
                } catch (e) {
                    error = e
                }

                expect(error).toBeUndefined()
            })

            it('will throw if the validator throws, and will close the in app browser', async () => {
                const linking = Object.assign(createListener(), {
                    openURL: () => {},
                })
                const appState = createListener()
                const validator = jest.fn(async () => {
                    throw 'hi'
                })
                const browser = createInAppBrowser({ available: true })

                const promise = authWithDeepRedirect(
                    'https://authurl.com/auth',
                    validator,
                    linking,
                    appState,
                    browser,
                )

                // wait the in app browser check
                await Promise.resolve()

                let error

                try {
                    linking.emit('url', { url: 'myurl' })
                    await promise
                } catch (e) {
                    error = e
                }

                expect(error).toBe('hi')
                expect(browser.close).toBeCalled()
            })

            it('will throw if the in app browser is closed', async () => {
                const linking = Object.assign(createListener(), {
                    openURL: () => {},
                })
                const appState = createListener()
                const validator = jest.fn(async () => 'token')
                const browser = createInAppBrowser({
                    available: true,
                    resultType: 'cancel',
                })

                const promise = authWithDeepRedirect(
                    'https://authurl.com/auth',
                    validator,
                    linking,
                    appState,
                    browser,
                )

                // wait the in app browser check
                await Promise.resolve()

                let error

                try {
                    await promise
                } catch (e) {
                    error = e
                }

                expect(error).toBe('Sign-in cancelled')
                expect(browser.close).toBeCalled()
            })

            it('will still auth if the browser is closed before the link handler is called', async () => {
                const linking = Object.assign(createListener(), {
                    openURL: () => {},
                })
                const appState = createListener()
                const validator = jest.fn(async () => 'token')
                const browser = createInAppBrowser({
                    available: true,
                    resultType: 'dismiss',
                })

                const promise = authWithDeepRedirect(
                    'https://authurl.com/auth',
                    validator,
                    linking,
                    appState,
                    browser,
                )

                // wait the in app browser check
                await Promise.resolve()

                // wait the for the browser to close
                await Promise.resolve()

                linking.emit('url', { url: 'myurl' })

                const val = await promise

                expect(val).toBe('token')
                expect(validator).toBeCalledWith('myurl')
            })
        })
    })
})
