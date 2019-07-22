import { fetchAndPersistUserAccessTokenWithType } from '../helpers'
import { authWithDeepRedirect } from '../deep-link-auth'
import { FACEBOOK_CLIENT_ID } from '../constants'
import qs from 'query-string'
import invariant from 'invariant'

const facebookRedirectURI = `fb${FACEBOOK_CLIENT_ID}://authorize`

const getFacebookOAuthURL = (validatorString: string) =>
    `https://www.facebook.com/v3.3/dialog/oauth?${qs.stringify({
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
    authWithDeepRedirect(getFacebookOAuthURL(validatorString), async url => {
        invariant(url.startsWith(facebookRedirectURI), 'Login cancelled')

        const params = qs.parse(url.split('#')[1])

        invariant(
            params.state === validatorString,
            'Login session expired, please try again',
        )

        invariant(params.access_token, 'Something went wrong')

        return params.access_token as string
    }).then(fbToken =>
        fetchAndPersistUserAccessTokenWithType('facebook', fbToken),
    )

export { facebookAuthWithDeepRedirect }
