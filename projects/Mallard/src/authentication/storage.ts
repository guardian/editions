import * as Keychain from 'react-native-keychain'
import { UserData } from './helpers'
import AsyncStorage from '@react-native-community/async-storage'
import { CasExpiry } from 'src/services/content-auth-service'
import { Settings } from 'react-native'
import DeviceInfo from 'react-native-device-info'

/**
 * this is ostensibly used to find the legacy binary data from the old GCE app
 */
const createSyncBinaryCacheIOS = <T = any>(key: string) => ({
    set: (value: T) => Settings.set({ [key]: value }),
    get: (): T => Settings.get(key),
    reset: (): void => Settings.set({ [key]: void 0 }),
})

const legacyCASUsernameCache = createSyncBinaryCacheIOS<string>(
    'printSubscriberID',
)

const legacyCASPasswordCache = createSyncBinaryCacheIOS<string>(
    'printSubscriberPostcode',
)

const legacyCASExpiryCache = createSyncBinaryCacheIOS<CasExpiry>(
    `${DeviceInfo.getBundleId()}_expiryDict`,
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
}
