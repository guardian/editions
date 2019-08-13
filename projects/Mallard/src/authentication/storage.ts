import * as Keychain from 'react-native-keychain'
import { UserData } from './helpers'
import AsyncStorage from '@react-native-community/async-storage'
import { CasExpiry } from 'src/services/content-auth-service'
import { Settings } from 'react-native'
import { ReceiptIOS } from '../services/iap'
import {
    LEGACY_SUBSCRIBER_ID_USER_DEFAULT_KEY,
    LEGACY_SUBSCRIBER_POSTCODE_USER_DEFAULT_KEY,
    LEGACY_CAS_EXPIRY_USER_DEFAULTS_KEY,
} from 'src/constants'

/**
 * this is ostensibly used to get the legacy data from the old GCE app
 * `Settings` only works on iOS but we only ever had a legacy app on iOS
 * and not Android.
 */
const createSyncCacheIOS = <T = any>(key: string) => ({
    set: (value: T) => Settings.set({ [key]: value }),
    get: (): T => Settings.get(key),
    reset: (): void => Settings.set({ [key]: void 0 }),
})

const legacyCASUsernameCache = createSyncCacheIOS<string>(
    LEGACY_SUBSCRIBER_ID_USER_DEFAULT_KEY,
)

const legacyCASPasswordCache = createSyncCacheIOS<string>(
    LEGACY_SUBSCRIBER_POSTCODE_USER_DEFAULT_KEY,
)

const legacyCASExpiryCache = createSyncCacheIOS<CasExpiry>(
    LEGACY_CAS_EXPIRY_USER_DEFAULTS_KEY,
)

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

const iapReceiptCache = createAsyncCache<ReceiptIOS>('iap-receipt-cache')

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

const userAccessTokenKeychain = createServiceTokenStore('UserAccessToken')
const membershipAccessTokenKeychain = createServiceTokenStore(
    'MembershipServiceAccessToken',
)
const casCredentialsKeychain = createServiceTokenStore('CASCredentials')

/**
 * For the legacy token we're not going to expose the whole store as we're never going
 * to write to if from the application and additionally, the token is set in a JSON object
 * in the old app so we need to fetch that out in the `getLegacyUserAccessToken` helper.
 */
const _legacyUserAccessTokenKeychain = createServiceTokenStore('AccessToken')

const getLegacyUserAccessToken = async (): ReturnType<
    typeof _legacyUserAccessTokenKeychain.get
> => {
    const token = await _legacyUserAccessTokenKeychain.get()
    if (!token) return token

    return {
        ...token,
        password: JSON.parse(token.password).accessToken,
    }
}

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
        _legacyUserAccessTokenKeychain.reset(),
        legacyCASExpiryCache.reset(),
        iapReceiptCache.reset(),
    ]).then(all => all.every(_ => _))

export {
    userAccessTokenKeychain,
    membershipAccessTokenKeychain,
    casCredentialsKeychain,
    resetCredentials,
    casDataCache,
    userDataCache,
    getLegacyUserAccessToken,
    legacyCASExpiryCache,
    legacyCASUsernameCache,
    legacyCASPasswordCache,
    iapReceiptCache,
}
