import {
    membershipAccessTokenKeychain,
    userAccessTokenKeychain,
} from './keychain'
import { fetchMembershipData } from 'src/services/membership-service'
import {
    fetchMembershipAccessToken,
    fetchUserAccessTokenWithIdentity,
    fetchUserAccessTokenWithType,
    TokenType,
} from 'src/services/id-service'

const parseSearchString = (searchString: string) => {
    const paramString = searchString.split('&')
    const init: { [key: string]: string } = {}
    return paramString.reduce((acc, p) => {
        const [key, value] = p.split('=')
        return { ...acc, [key]: decodeURIComponent(value) }
    }, init)
}

const createSearchParams = (params: { [key: string]: string } = {}) =>
    Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join('&')

const fetchAndPersistUserAccessTokenWithIdentity = async (
    email: string,
    password: string,
) => {
    const token = await fetchUserAccessTokenWithIdentity(email, password)
    await userAccessTokenKeychain.set(email, token)
    return token
}

const fetchAndPersistUserAccessTokenWithType = async (
    tokenType: TokenType,
    authToken: string,
): Promise<string> => {
    const token = await fetchUserAccessTokenWithType(tokenType, authToken)
    await userAccessTokenKeychain.set(`token::${tokenType}`, token)
    return token
}

const fetchMembershipDataForKeychainUser = async () => {
    const membershipToken = await membershipAccessTokenKeychain.get()
    if (membershipToken) return fetchMembershipData(membershipToken.password)

    // no cached membership token, try and get the userToken so we can generate a new membership token
    const userToken = await userAccessTokenKeychain.get()
    if (!userToken) {
        // no userToken - we need to be logged in again
        return null
    }
    const newMembershipToken = await fetchMembershipAccessToken(
        userToken.password,
    )
    // cache the new token
    membershipAccessTokenKeychain.set(userToken.username, newMembershipToken)
    return fetchMembershipData(newMembershipToken)
}

export {
    fetchAndPersistUserAccessTokenWithIdentity,
    fetchAndPersistUserAccessTokenWithType,
    fetchMembershipDataForKeychainUser,
    parseSearchString,
    createSearchParams,
}
