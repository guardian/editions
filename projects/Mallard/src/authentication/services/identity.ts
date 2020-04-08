import qs from 'query-string'
import { AuthResult, fromResponse } from '../lib/Result'
import { ID_API_URL, ID_ACCESS_TOKEN } from 'src/constants'
import { GENERIC_AUTH_ERROR } from 'src/helpers/words'
import { AuthType } from '../authorizers/IdentityAuthorizer'

interface ErrorReponse {
    errors: { message: string; description: string }[]
}

const hasErrorsArray = (json: any): json is ErrorReponse =>
    json && Array.isArray(json.errors)

const getErrorString = (data: any) =>
    hasErrorsArray(data)
        ? data.errors.map(err => err.description).join(', ')
        : GENERIC_AUTH_ERROR

const fetchAuth = async <T>(
    params: { [key: string]: string },
    authType?: AuthType,
    authUrl: string = ID_API_URL,
    token: string = ID_ACCESS_TOKEN,
): Promise<AuthResult<T>> => {
    const res = await fetch(`${authUrl}/auth`, {
        method: 'POST',
        headers: {
            'X-GU-ID-Client-Access-Token': `Bearer ${token}`,
            'Content-Type':
                authType === 'apple'
                    ? 'application/json'
                    : 'application/x-www-form-urlencoded',
        },
        body:
            authType === 'apple'
                ? JSON.stringify(params)
                : qs.stringify(params),
    })

    return fromResponse(res, {
        valid: data => data.accessToken.accessToken,
        invalid: getErrorString,
    })
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

    return fromResponse(res, {
        valid: data => data.user,
        invalid: getErrorString,
    })
}

export { fetchUserDetails, fetchAuth, fetchMembershipToken }
