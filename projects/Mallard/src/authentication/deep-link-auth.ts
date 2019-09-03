import { Linking, AppState } from 'react-native'
import InAppBrowser from 'react-native-inappbrowser-reborn'

interface Emitter<T> {
    addEventListener(type: string, cb: (e: T) => void): void
    removeEventListener(type: string, cb: Function): void
}

type IAppState = Emitter<string>

const createAppChangeListener = (
    fn: (state: string) => void,
    appStateEmitter: IAppState,
) => {
    appStateEmitter.addEventListener('change', fn)
    return () => appStateEmitter.removeEventListener('change', fn)
}

type ILinking = Emitter<{ url: string }> & {
    openURL: (url: string) => void
}

const createLinkListener = (
    fn: (event: { url: string }) => void,
    linkingImpl: ILinking,
) => {
    linkingImpl.addEventListener('url', fn)
    return () => linkingImpl.removeEventListener('url', fn)
}

type IInAppBrowser = Pick<typeof InAppBrowser, 'close' | 'open' | 'isAvailable'>

/**
 * This function will open an auth url and wait for the first navigation back to the app
 * if extractTokenAndValidateState returns a token then the promise will be resolved
 * otherwise the promise will reject to make sure we have removed the event listener
 * in the case where someone redirects to the app without a token and then attempts the login
 * flow again (which would have created two listeners)
 */
const authWithDeepRedirect = async (
    authUrl: string,
    extractTokenAndValidateState: (url: string) => Promise<string>,
    /* mocks for testing */
    linkingImpl: ILinking = Linking,
    appStateImpl: IAppState = AppState,
    inAppBrowserImpl: IInAppBrowser = InAppBrowser,
): Promise<string> => {
    return new Promise(async (res, rej) => {
        let unlisteners: (() => void)[] = []

        const onFinish = async (url?: string) => {
            inAppBrowserImpl.close()

            let unlistener
            while ((unlistener = unlisteners.pop())) {
                unlistener()
            }

            if (!url) {
                rej('Sign-in cancelled')
            } else {
                try {
                    res(await extractTokenAndValidateState(url))
                } catch (e) {
                    rej(e)
                }
            }
        }

        const unlistenLink = createLinkListener((event: { url: string }) => {
            // eslint-disable-next-line
            onFinish(event.url)
        }, linkingImpl)

        unlisteners.push(unlistenLink)

        if (await inAppBrowserImpl.isAvailable()) {
            await inAppBrowserImpl.open(authUrl, {
                // iOS Properties
                dismissButtonStyle: 'cancel',
                // Android Properties
                showTitle: false,
                enableUrlBarHiding: true,
                enableDefaultShare: true,
            })
            // The deep link handler is called before the `InAppBrowser.open` promise resolves
            // so we can tidy up happily here in case there was a cancelled event.
            // This call may end up rejecting the promise _again_ (after it's already been
            // resolved / rejected) but this is basically a noop
            onFinish()
        } else {
            const unlistenAppState = createAppChangeListener(
                (currentState: string) => {
                    if (currentState === 'active') {
                        // This is being run when
                        // make sure the link handler is removed whenever we come back to the app
                        // url is called first in the happy path so the promise will have resolved by then
                        // otherwise, if they navigate back without authenticating, remove the listener and cancel the login

                        // eslint-disable-next-line
                        onFinish()
                    }
                },
                appStateImpl,
            )
            unlisteners.push(unlistenAppState)
            // open in the browser if in app browsers are not supported
            linkingImpl.openURL(authUrl)
        }
    })
}

export { authWithDeepRedirect }
