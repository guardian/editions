import { Linking, AppState } from 'react-native'

interface Emitter<T> {
    addEventListener(type: string, cb: (e: T) => void): void
    removeEventListener(type: string, cb: Function): void
}

/**
 * This function will open an auth url and wait for the first navigation back to the app
 * if extractTokenAndValidateState returns a token then the promise will be resolved
 * otherwise the promise will reject to make sure we have removed the event listener
 * in the case where someone redirects to the app without a token and then attempts the login
 * flow again (which would have created two listeners)
 */
const authWithDeepRedirect = (
    authUrl: string,
    extractTokenAndValidateState: (url: string) => Promise<string>,
    /* mocks for testing */
    linkingEmitter: Emitter<{ url: string }> & {
        openURL: (url: string) => void
    } = Linking,
    appStateEmitter: Emitter<string> = AppState,
): Promise<string> => {
    Linking.openURL(authUrl)
    return new Promise(async (res, rej) => {
        const linkHandler = async ({ url }: { url: string }) => {
            linkingEmitter.removeEventListener('url', linkHandler)
            // eslint-disable-next-line
            appStateEmitter.removeEventListener('change', appChangeHandler)

            try {
                res(await extractTokenAndValidateState(url))
            } catch (e) {
                rej(e)
            }
        }

        const appChangeHandler = (currentState: string) => {
            if (currentState === 'active') {
                // make sure the link handler is removed whenever we come back to the app
                // url is called first in the happy path so the promise will have resolved by then
                // otherwise, if they navigate back without authenticating, remove the listener and cancel the login
                linkingEmitter.removeEventListener('url', linkHandler)
                AppState.removeEventListener('change', appChangeHandler)
                rej('Sign-in cancelled')
            }
        }

        linkingEmitter.addEventListener('url', linkHandler)
        appStateEmitter.addEventListener('change', appChangeHandler)
    })
}

export { authWithDeepRedirect }
