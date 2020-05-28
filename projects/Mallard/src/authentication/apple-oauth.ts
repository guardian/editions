import qs from 'query-string'

const appleRedirectURI =
    'https://idapi.theguardian.com/auth/apple/auth-redirect'

export const getAppleOAuthURL = (validatorString: string) =>
    `https://appleid.apple.com/auth/authorize?${qs.stringify(
        {
            client_id: 'com.theguardian.editions',
            response_type: 'code id_token',
            redirect_uri: appleRedirectURI,
            scope: ['name', 'email'].join(' '),
            state: validatorString,
            response_mode: 'form_post',
        },
        { encode: true },
    )}`
