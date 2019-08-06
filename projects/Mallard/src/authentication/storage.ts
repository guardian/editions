import * as Keychain from 'react-native-keychain'
import {
    ID_API_URL,
    MEMBERS_DATA_API_URL,
    CAS_ENDPOINT_URL,
} from '../constants'
import { UserData } from './helpers'
import AsyncStorage from '@react-native-community/async-storage'
import { CasExpiry } from 'src/services/content-auth-service'

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

const casDataCache = createAsyncCache<CasExpiry>('cas-data-cache')

const userDataCache = createAsyncCache<UserData>('user-data-cache')

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
const casCredentialsKeychain = createServiceTokenStore(CAS_ENDPOINT_URL)

/**
 * Removes all the relevent keychain, storage entries that mark a user as logged in
 * and returns a boolean indicating whether all these operations succeeded
 */
const resetCredentials = (): Promise<boolean> =>
    Promise.all([
        userAccessTokenKeychain.reset(),
        membershipAccessTokenKeychain.reset(),
        userDataCache.reset(),
        casCredentialsKeychain.reset(),
        casDataCache.reset(),
    ]).then(all => all.every(_ => _))

export {
    userAccessTokenKeychain,
    membershipAccessTokenKeychain,
    casCredentialsKeychain,
    resetCredentials,
    casDataCache,
    userDataCache,
}
