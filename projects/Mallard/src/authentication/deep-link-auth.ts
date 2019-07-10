import { Linking, AppState } from 'react-native'

/**
 * This function will open an auth url and wait for the first navigation back to the app
 * if extractTokenAndValidateState returns a token then the promise will be resolved
 * otherwise the promise will reject to make sure we have removed the event listener
 * in the case where someone redirects to the app without a token and then attempts the login
 * flow again (which would have created two listeners)
 */
const authWithDeepRedirect = (
    authUrl: string,
    extractTokenAndValidateState: (url: string) => Promise<string | false>,
): Promise<string> => {
    Linking.openURL(authUrl)
    return new Promise((res, rej) => {
        const linkHandler = async ({ url }: { url: string }) => {
            const maybeToken = await extractTokenAndValidateState(url)
            // `once` doesn't seem to work
            Linking.removeEventListener('url', linkHandler)
            if (maybeToken !== false) {
                res(maybeToken)
            } else {
                rej('Something went wrong')
            }
        }
        Linking.addEventListener('url', linkHandler)

        const appChangeHandler = (currentState: string) => {
            if (currentState === 'active') {
                // make sure the link handler is removed whenever we come back to the app
                // url is called first in the happy path so the promise will have resolved by then
                // otherwise, if they navigate back without authenticating, remove the listener and cancel the login
                Linking.removeEventListener('url', linkHandler)
                AppState.removeEventListener('change', appChangeHandler)
                rej('Login cancelled')
            }
        }

        AppState.addEventListener('change', appChangeHandler)
    })
}

export { authWithDeepRedirect }
