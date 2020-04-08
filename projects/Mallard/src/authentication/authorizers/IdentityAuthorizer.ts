import { Authorizer } from '../lib/Authorizer'
import { AuthResult, flat, InvalidResult, ValidResult } from '../lib/Result'
import {
    fetchAuth,
    fetchMembershipToken,
    fetchUserDetails,
    User,
} from '../services/identity'
import {
    fetchMembershipData,
    MembersDataAPIResponse,
} from '../services/membership'
import {
    userDataCache,
    userAccessTokenKeychain,
    membershipAccessTokenKeychain,
    legacyUserAccessTokenKeychain,
} from 'src/helpers/storage'
import { canViewEdition } from '../helpers'

type BasicCreds = {
    email: string
    password: string
}

type FacebookCreds = {
    'facebook-access-token': string
}

type GoogleCreds = {
    'google-access-token': string
}

export type AppleCreds = {
    authorizationCode: string
    idToken: string
    givenName: string
    familyName: string
}

export type AuthParams = BasicCreds | FacebookCreds | GoogleCreds | AppleCreds

export type AuthType = 'apple' | 'google' | 'facebook' | 'email' | 'unknown'

// TODO: Write unit test?
const detectAuthType = (params: AuthParams): AuthType => {
    if ('email' in params) return 'email'
    if ('facebook-access-token' in params) return 'facebook'
    if ('google-access-token' in params) return 'google'
    if ('idToken' in params) return 'apple'
    return 'unknown'
}

export type IdentityAuthData = {
    userDetails: User
    membershipData: MembersDataAPIResponse
}

const authWithTokens = async (
    utoken: string,
    mtoken: string,
): Promise<AuthResult<IdentityAuthData>> => {
    const [userDetailsResult, membershipDataResult] = await Promise.all([
        fetchUserDetails(utoken),
        fetchMembershipData(mtoken),
    ])
    return flat(userDetailsResult, userDetails =>
        flat(membershipDataResult, async membershipData =>
            ValidResult({
                userDetails,
                membershipData,
            }),
        ),
    )
}

// TODO: This function needs a unit test
const getUserName = (authType: AuthType, params: AuthParams) => {
    const x = params
    switch (authType) {
        case 'email':
            if ('email' in params) {
                return params.email
            }
        case 'facebook':
            return 'gu-editions::token::facebook'
        case 'google':
            return 'gu-editions::token::google'
        case 'apple':
            return 'gu-editions::token::apple'
        default:
            return x
    }
    return x
}

export default new Authorizer({
    name: 'identity',
    userDataCache,
    authCaches: [
        userAccessTokenKeychain,
        membershipAccessTokenKeychain,
        legacyUserAccessTokenKeychain,
    ] as const,
    auth: async ([params]: [AuthParams], [utc, mtc]) => {
        const authType = detectAuthType(params)
        const username = getUserName(authType, params)
        const utokenResult = await fetchAuth<string>(params, authType)

        return flat(utokenResult, async utoken => {
            utc.set({ username, token: utoken })
            const mtokenResult = await fetchMembershipToken(utoken)

            return flat(mtokenResult, mtoken => {
                mtc.set({ username, token: mtoken })
                return authWithTokens(utoken, mtoken)
            })
        })
    },
    authWithCachedCredentials: async ([utc, mtc, lutc]) => {
        const [nutoken, lutoken, mtoken] = await Promise.all([
            utc.get(),
            lutc.get(),
            mtc.get(),
        ])
        const utoken = nutoken || lutoken
        if (!utoken || !mtoken) return InvalidResult()
        return authWithTokens(utoken.password, mtoken.password)
    },
    checkUserHasAccess: canViewEdition,
})
