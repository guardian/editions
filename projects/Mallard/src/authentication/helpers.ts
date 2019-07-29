import {
    membershipAccessTokenKeychain,
    userAccessTokenKeychain,
} from './keychain'
import {
    fetchMembershipData,
    MembersDataAPIResponse,
} from 'src/services/membership-service'
import {
    fetchMembershipAccessToken,
    fetchUserAccessTokenWithIdentity,
    fetchUserAccessTokenWithType,
    TokenType,
} from 'src/services/id-service'

/**
 * This helper attempts to get an Identity user access token with an email and password.
 *
 * It will also cache that token in the keychain if successful.
 *
 * This method will throw an error if it was unsuccesful.
 */
const fetchAndPersistUserAccessTokenWithIdentity = async (
    email: string,
    password: string,
): Promise<string> => {
    const token = await fetchUserAccessTokenWithIdentity(email, password)
    await userAccessTokenKeychain.set(email, token)
    return token
}

/**
 * This helper attempts to use a token from an OAuth provider (that is supported by
 * idenity - currently 'facebook' and 'google') and use that to get an Identity user
 * access token.
 *
 * It will also cache that token in the keychain if successful.
 *
 * This method will throw an error if it was unsuccesful.
 */
const fetchAndPersistUserAccessTokenWithType = async (
    tokenType: TokenType,
    authToken: string,
): Promise<string> => {
    const token = await fetchUserAccessTokenWithType(tokenType, authToken)
    await userAccessTokenKeychain.set(`gu-editions::token::${tokenType}`, token)
    return token
}

/**
 * This should be used when you know you want to query members-data-api
 * for live data i.e. when the user has attempted to login or when we
 * want to revalidate a user's signin status (do they still have the right
 * identity subscriptions to use the app)
 *
 * N.b. this function does NOT check whether the user has sufficient permissions,
 * it simply returns the record of permission for a user
 */
const fetchMembershipDataForKeychainUser = async (
    /* mocks for testing */
    membershipTokenStore = membershipAccessTokenKeychain,
    userTokenStore = userAccessTokenKeychain,
    fetchMembershipDataImpl = fetchMembershipData,
    fetchMembershipAccessTokenImpl = fetchMembershipAccessToken,
): Promise<MembersDataAPIResponse | null> => {
    const membershipToken = await membershipTokenStore.get()
    if (membershipToken)
        return fetchMembershipDataImpl(membershipToken.password)

    // no cached membership token, try and get the userToken so we can generate a new membership token
    const userToken = await userTokenStore.get()
    if (!userToken) {
        // no userToken - we need to be logged in again
        return null
    }
    const newMembershipToken = await fetchMembershipAccessTokenImpl(
        userToken.password,
    )
    // cache the new token
    membershipTokenStore.set(userToken.username, newMembershipToken)
    return fetchMembershipDataImpl(newMembershipToken)
}

/**
 * This takes the membersDataApiResponse and is responsible for returning a boolean
 * describing whether or not the user has the relevant permissions to use the app
 */
const canViewEdition = (
    membersDataApiResponse: MembersDataAPIResponse,
): boolean => membersDataApiResponse.contentAccess.digitalPack

export {
    fetchAndPersistUserAccessTokenWithIdentity,
    fetchAndPersistUserAccessTokenWithType,
    fetchMembershipDataForKeychainUser,
    canViewEdition,
}
