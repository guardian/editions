import { Linking, AppState } from 'react-native'

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

        const foregroundHandler = (currentState: string) => {
            if (currentState === 'active') {
                // make sure this handler is removed whenever we come back to the app
                // url is called first in the happy path so the promise will have resolved
                // otherwise, if they navigate back without authenticating, just cancel the login
                Linking.removeEventListener('url', linkHandler)
                AppState.removeEventListener('change', foregroundHandler)
                rej('Login cancelled')
            }
        }

        AppState.addEventListener('change', foregroundHandler)
    })
}

export { authWithDeepRedirect }
