import qs from 'query-string'
import { AuthResult, fromResponse } from '../lib/Result'
import { ID_API_URL, ID_ACCESS_TOKEN } from 'src/constants'
import { GENERIC_AUTH_ERROR } from 'src/helpers/words'

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
    authUrl: string = ID_API_URL,
    token: string = ID_ACCESS_TOKEN,
): Promise<AuthResult<T>> => {
    console.log("FETCH_AUTH", params, authUrl, token)

    const res = await fetch(`${authUrl}/auth`, {
        method: 'POST',
        headers: {
            'X-GU-ID-Client-Access-Token': `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: qs.stringify(params),
    })

    // console.log('>>>>>>>>>>>>>>>>>>>>>>>>')
    // console.log('AUTH PARAMS', params, authUrl, token)
    // console.log('AUTH CALL', res)

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
