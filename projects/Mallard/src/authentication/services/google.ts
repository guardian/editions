import { fetchAndPersistUserAccessTokenWithType } from '../helpers'
import { authWithDeepRedirect } from '../deep-link-auth'
import { GOOGLE_CLIENT_ID } from '../constants'
import { createSearchParams, parseSearchString } from 'src/helpers/url'
import invariant from 'invariant'

const googleRedirectURI = `com.googleusercontent.apps.${GOOGLE_CLIENT_ID}:authorize`

const getGoogleOAuthURL = (validatorString: string) =>
    fetch('https://accounts.google.com/.well-known/openid-configuration')
        .then(res => res.json())
        .then(
            json =>
                `${json.authorization_endpoint}?${createSearchParams({
                    client_id: `${GOOGLE_CLIENT_ID}.apps.googleusercontent.com`,
                    response_type: 'code',
                    redirect_uri: googleRedirectURI,
                    // I think these are the two scopes required by identity and are what the apps use
                    scope: ['profile', 'email'].join('%20'),
                    // always re-authenticate when clicking the fb login button
                    // seeing it means the user will have logged out
                    prompt: 'select_account',
                    // this will help prevent CSRF
                    state: validatorString,
                })}`,
        )

const getGoogleTokenFromCode = (code: string) =>
    fetch('https://www.googleapis.com/oauth2/v4/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: createSearchParams({
            code,
            client_id: GOOGLE_CLIENT_ID,
            redirect_uri: googleRedirectURI,
            grant_type: 'authorization_code',
        }),
    })
        .then(res => res.json())
        .then(json => json.access_token)

const googleAuthWithDeepRedirect = (validatorString: string): Promise<string> =>
    getGoogleOAuthURL(validatorString).then(authUrl =>
        authWithDeepRedirect(authUrl, async url => {
            invariant(url.startsWith(googleRedirectURI), 'Login cancelled')

            const params = parseSearchString(url.split('?')[1])

            invariant(
                params.state === validatorString,
                'Login session expired, please try again',
            )

            invariant(params.code, 'Something went wrong')

            return getGoogleTokenFromCode(params.code)
        }).then(fbToken =>
            fetchAndPersistUserAccessTokenWithType('google', fbToken),
        ),
    )

export { googleAuthWithDeepRedirect }
