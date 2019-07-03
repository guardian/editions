import { ID_AUTH_URL, ID_ACCESS_TOKEN } from 'src/authentication/constants'

const fetchAuth = (init: RequestInit = {}) =>
    fetch(ID_AUTH_URL, {
        ...init,
        method: 'POST',
        headers: {
            ...(init.headers || {}),
            'X-GU-ID-Client-Access-Token': `Bearer ${ID_ACCESS_TOKEN}`,
        },
    })
        .then(res => {
            if (res.status !== 200) {
                throw new Error('Invalid credentials')
            }
            return res.json()
        })
        .then(json => json.accessToken.accessToken)

const fetchUserAccessToken = (email: string, password: string) =>
    fetchAuth({
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
        }),
    })

const fetchMembershipAccessToken = (userAccessToken: string) =>
    fetchAuth({
        method: 'POST',
        headers: {
            'X-GU-ID-Client-Access-Token': `Bearer ${ID_ACCESS_TOKEN}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `user-access-token=${userAccessToken}&target-client-id=membership`,
    })

export { fetchUserAccessToken, fetchMembershipAccessToken }
