import { ID_AUTH_URL, ID_ACCESS_TOKEN } from 'src/authentication/constants'

const fetchAuth = async (init: RequestInit = {}) => {
    const res = await fetch(`${ID_AUTH_URL}`, {
        ...init,
        method: 'POST',
        headers: {
            ...(init.headers || {}),
            'X-GU-ID-Client-Access-Token': `Bearer ${ID_ACCESS_TOKEN}`,
        },
    })
    const json = await res.json()

    if (res.status !== 200) {
        console.log(json)
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
    fetchAuth({
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
        }),
    })

const fetchUserAccessTokenWithFacebook = (token: string) =>
    fetchAuth({
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `facebook-access-token=${token}`,
    })

const fetchMembershipAccessToken = (userAccessToken: string) =>
    fetchAuth({
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `user-access-token=${userAccessToken}&target-client-id=membership`,
    })

export {
    fetchUserAccessTokenWithIdentity,
    fetchUserAccessTokenWithFacebook,
    fetchMembershipAccessToken,
}
