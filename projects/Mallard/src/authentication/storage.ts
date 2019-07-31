import * as Keychain from 'react-native-keychain'
import { ID_API_URL, MEMBERS_DATA_API_URL } from './constants'
import { userDataCache } from './helpers'

/**
 * Creates a simple store (wrapped around the keychain) for tokens.
 *
 * This is keyed off the given service.
 */
const createServiceTokenStore = (service: string) => ({
    get: () => Keychain.getGenericPassword({ service }),
    set: (username: string, token: string) =>
        Keychain.setGenericPassword(username, token, { service }),
    reset: () => Keychain.resetGenericPassword({ service }),
})

const userAccessTokenKeychain = createServiceTokenStore(ID_API_URL)
const membershipAccessTokenKeychain = createServiceTokenStore(
    MEMBERS_DATA_API_URL,
)

/**
 * Removes all the relevent keychain, storage entries that mark a user as logged in
 * and returns a boolean indicating whether all these operations succeeded
 */
const resetCredentials = (): Promise<boolean> =>
    Promise.all([
        userAccessTokenKeychain.reset(),
        membershipAccessTokenKeychain.reset(),
        userDataCache.reset(),
    ]).then(all => all.every(_ => _))

export {
    userAccessTokenKeychain,
    membershipAccessTokenKeychain,
    resetCredentials,
}
