import {
    membershipAccessTokenKeychain,
    userAccessTokenKeychain,
    resetCredentials,
} from './storage'
import {
    fetchMembershipData,
    MembersDataAPIResponse,
} from 'src/services/membership-service'
import {
    fetchMembershipAccessToken,
    fetchUserAccessTokenWithIdentity,
    fetchUserAccessTokenWithType,
    TokenType,
    fetchUserDetails,
    User,
} from 'src/services/id-service'
import AsyncStorage from '@react-native-community/async-storage'

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
 * A wrapper around AsyncStorage, with json handling and standardizing the interface
 * between AsyncStorage and the keychain helper below
 */
const createAsyncCache = <T extends object>(key: string) => ({
    set: (value: T) => AsyncStorage.setItem(key, JSON.stringify(value)),
    get: (): Promise<T | null> =>
        AsyncStorage.getItem(key).then(value => value && JSON.parse(value)),
    reset: (): Promise<boolean> =>
        AsyncStorage.removeItem(key).then(() => true),
})

export interface UserData {
    userDetails: User
    membershipData: MembersDataAPIResponse
}

const userDataCache = createAsyncCache<UserData>('user-data-cache')

/**
 * This should be used when you know you want to query members-data-api
 * for live data i.e. when the user has attempted to login or when we
 * want to revalidate a user's signin status (do they still have the right
 * identity subscriptions to use the app)
 *
 * N.b. this function does NOT check whether the user has sufficient permissions,
 * it simply returns the record of permission for a user
 */
const fetchUserDataForKeychainUser = async (
    /* mocks for testing */
    membershipTokenStore = membershipAccessTokenKeychain,
    userTokenStore = userAccessTokenKeychain,
    fetchMembershipDataImpl = fetchMembershipData,
    fetchMembershipAccessTokenImpl = fetchMembershipAccessToken,
): Promise<UserData | null> => {
    const [userToken, membershipToken] = await Promise.all([
        userTokenStore.get(),
        membershipTokenStore.get(),
    ])

    if (!userToken) {
        // no userToken - we need to be logged in again
        // make sure everything is reset before doing that
        await resetCredentials()
        return null
    }

    let newMembershipToken: string | null = null

    if (!membershipToken) {
        // if there's not a membership token then something went wrong,
        // but we can fetch it again
        newMembershipToken = await fetchMembershipAccessTokenImpl(
            userToken.password,
        )
        membershipTokenStore.set(userToken.username, newMembershipToken)
    } else {
        newMembershipToken = membershipToken.password
    }

    const [userDetails, membershipData] = await Promise.all([
        fetchUserDetails(userToken.password),
        fetchMembershipDataImpl(newMembershipToken),
    ])

    const userData = {
        userDetails,
        membershipData,
    }

    userDataCache.set(userData)

    return userData
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
    fetchUserDataForKeychainUser,
    canViewEdition,
    userDataCache,
}
