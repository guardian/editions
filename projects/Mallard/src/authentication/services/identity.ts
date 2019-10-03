import qs from 'query-string'
import { AuthResult, InvalidResult, ValidResult } from '../lib/Result'
import { ID_API_URL, ID_ACCESS_TOKEN } from 'src/constants'

interface ErrorReponse {
    errors: { message: string; description: string }[]
}

const hasErrorsArray = (json: any): json is ErrorReponse =>
    json && Array.isArray(json.errors)

const fetchAuth = async <T>(
    params: { [key: string]: string },
    authUrl: string = ID_API_URL,
    token: string = ID_ACCESS_TOKEN,
): Promise<AuthResult<T>> => {
    const res = await fetch(`${authUrl}/auth`, {
        method: 'POST',
        headers: {
            'X-GU-ID-Client-Access-Token': `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: qs.stringify(params),
    })
    if (res.status >= 500) return InvalidResult('Something went wrong')
    const data = await res.json()
    if (res.ok) return ValidResult(data.accessToken.accessToken)
    if (hasErrorsArray(data)) {
        return InvalidResult(data.errors.join('.\n'))
    }
    return InvalidResult('Something went wrong')
}

const fetchMembershipToken = (userToken: string) =>
    fetchAuth<string>({
        'user-access-token': userToken,
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
): Promise<AuthResult<User>> => {
    const res = await fetch(`${authUrl}/user/me`, {
        headers: {
            Authorization: `Bearer ${userAccessToken}`,
        },
    })
    if (res.status >= 500) return InvalidResult('Something went wrong')
    const data = await res.json()
    if (res.ok) return ValidResult(data.user)
    if (hasErrorsArray(data)) {
        return InvalidResult(data.errors.join('.\n'))
    }
    return InvalidResult('Something went wrong')
}

export { fetchUserDetails, fetchAuth, fetchMembershipToken }
