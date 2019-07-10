import {
    fetchAndPersistUserAccessTokenWithType,
    parseSearchString,
    createSearchParams,
} from '../helpers'
import { authWithDeepRedirect } from '../deep-link-auth'
import { FACEBOOK_CLIENT_ID } from '../constants'

const facebookRedirectURI = `fb${FACEBOOK_CLIENT_ID}://authorize`

const getFacebookOAuthURL = (validatorString: string) =>
    `https://www.facebook.com/v3.3/dialog/oauth?${createSearchParams({
        client_id: FACEBOOK_CLIENT_ID,
        response_type: 'token',
        redirect_uri: facebookRedirectURI,
        // I think these are the two scopes required by identity and are what the apps use
        scope: ['public_profile', 'email'].join(','),
        // always re-authenticate when clicking the fb login button
        // seeing it means the user will have logged out
        auth_type: 'reauthenticate',
        // this will help prevent CSRF
        state: validatorString,
    })}`

const facebookAuthWithDeepRedirect = (
    validatorString: string,
): Promise<string> =>
    authWithDeepRedirect(getFacebookOAuthURL(validatorString), url => {
        if (url.startsWith(facebookRedirectURI)) {
            const params = parseSearchString(url.split('#')[1])
            return params.state === validatorString
                ? Promise.resolve(params.access_token || false)
                : Promise.resolve(false)
        }
        return Promise.resolve(false)
    }).then(fbToken =>
        fetchAndPersistUserAccessTokenWithType('facebook', fbToken),
    )

export { facebookAuthWithDeepRedirect }
