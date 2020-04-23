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

export type AuthParams = BasicCreds | FacebookCreds | GoogleCreds

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

const getUserNameFromParams = (params: AuthParams) => {
    if ('email' in params) return params.email
    if ('facebook-access-token' in params) return 'gu-editions::token::facebook'
    if ('google-access-token' in params) return 'gu-editions::token::google'
    if ('apple-access-token' in params) return 'gu-editions::token::apple'

    const x: never = params
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
        const username = getUserNameFromParams(params)
        const utokenResult = await fetchAuth<string>(params)

        console.log('PARAMS', params)
        console.log('================')
        console.log('UTOKEN', utokenResult)

        return flat(utokenResult, async utoken => {
            utc.set({ username, token: utoken })
            const mtokenResult = await fetchMembershipToken(utoken)

            console.log('================')
            console.log('MTOKEN', mtokenResult)

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
