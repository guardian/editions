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
            const result = await inAppBrowserImpl.open(authUrl, {
                // iOS Properties
                dismissButtonStyle: 'cancel',
                // Android Properties
                showTitle: false,
                enableUrlBarHiding: true,
                enableDefaultShare: true,
            })

            switch (result.type) {
                case 'cancel': {
                    /**
                     * this was a user cancel so reject the promise
                     */
                    onFinish()
                    break
                }
                case 'dismiss': {
                    /**
                     * the assumption here is that a dismiss event happens when a deep link
                     * happens or some other non-user cirucmstance.
                     *
                     * On iOS, if this was a deep link then the link handler above should already have fired
                     * and resolved / rejected this promise (making the rest of thie code a noop).
                     * However, this isn't the case on Android. Also if it _wan't_ a deep link then
                     * we should clean up.
                     *
                     * Hence a second for other handlers to fire before rejecting the promise
                     */
                    setTimeout(() => onFinish(), 1000)
                    break
                }
            }
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
