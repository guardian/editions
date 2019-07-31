import { ID_API_URL, ID_ACCESS_TOKEN } from 'src/authentication/constants'
import qs from 'query-string'

interface ErrorReponse {
    errors: { message: string; description: string }[]
}

const hasErrorsArray = (json: any): json is ErrorReponse =>
    json && Array.isArray(json.errors)

const maybeThrowErrors = async (res: Response) => {
    const json = await res.json()

    if (res.status !== 200) {
        throw new Error(
            hasErrorsArray(json)
                ? json.errors
                      .map(err => `${err.message}: ${err.description}`)
                      .join(', ')
                : 'Invalid credentials',
        )
    }

    return json
}

const fetchAuth = async (
    params: { [key: string]: string },
    authUrl = ID_API_URL,
    token = ID_ACCESS_TOKEN,
): Promise<string> => {
    const res = await fetch(`${authUrl}/auth`, {
        method: 'POST',
        headers: {
            'X-GU-ID-Client-Access-Token': `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: qs.stringify(params),
    })
    return maybeThrowErrors(res).then(json => json.accessToken.accessToken)
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

export interface User {
    id: string
    dates: {
        accountCreatedDate: string
    }
    adData: {}
    consents: {
        id: string
        actor: string
        version: number
        consented: boolean
        timestamp: string
        privacyPolicyVersion: number
    }[]
    userGroups: {
        path: string
        packageCode: string
    }[]
    socialLinks: {
        network: string
        socialId: string
    }[]
    publicFields: {
        displayName: string
    }
    statusFields: {
        hasRepermissioned: boolean
        userEmailValidated: boolean
        allowThirdPartyProfiling: boolean
    }
    primaryEmailAddress: string
    hasPassword: boolean
}

const fetchUserDetails = async (
    userAccessToken: string,
    authUrl = ID_API_URL,
): Promise<User> => {
    const res = await fetch(`${authUrl}/user/me`, {
        headers: {
            Authorization: `Bearer ${userAccessToken}`,
        },
    })
    return maybeThrowErrors(res).then(json => json.user)
}

export {
    fetchAuth,
    fetchUserAccessTokenWithIdentity,
    fetchUserAccessTokenWithType,
    fetchMembershipAccessToken,
    fetchUserDetails,
}
