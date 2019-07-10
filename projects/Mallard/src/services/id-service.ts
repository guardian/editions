import { ID_AUTH_URL, ID_ACCESS_TOKEN } from 'src/authentication/constants'
import { createSearchParams } from 'src/authentication/helpers'

const fetchAuth = async (params: { [key: string]: string }) => {
    const res = await fetch(`${ID_AUTH_URL}`, {
        method: 'POST',
        headers: {
            'X-GU-ID-Client-Access-Token': `Bearer ${ID_ACCESS_TOKEN}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: createSearchParams(params),
    })
    const json = await res.json()

    if (res.status !== 200) {
        throw new Error(
            json.errors
                ? json.errors
                      .map((err: any) => `${err.message}: ${err.description}`)
                      .join(', ')
                : 'Invalid credentials',
        )
    }

    return json.accessToken.accessToken
}

const fetchUserAccessTokenWithIdentity = (email: string, password: string) =>
    fetchAuth({ email, password })

export type TokenType = 'facebook' | 'google'

const fetchUserAccessTokenWithType = (tokenType: TokenType, token: string) =>
    fetchAuth({ [`${tokenType}-access-token`]: token })

const fetchMembershipAccessToken = (userAccessToken: string) =>
    fetchAuth({
        'user-access-token': userAccessToken,
        'target-client-id': 'membership',
    })

export {
    fetchUserAccessTokenWithIdentity,
    fetchUserAccessTokenWithType,
    fetchMembershipAccessToken,
}
