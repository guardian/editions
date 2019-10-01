import AsyncStorage from '@react-native-community/async-storage'
import { Settings } from 'react-native'
import * as Keychain from 'react-native-keychain'
import {
    LEGACY_CAS_EXPIRY_USER_DEFAULTS_KEY,
    LEGACY_SUBSCRIBER_ID_USER_DEFAULT_KEY,
    LEGACY_SUBSCRIBER_POSTCODE_USER_DEFAULT_KEY,
} from 'src/constants'
import { CasExpiry } from 'src/services/content-auth-service'
import { UserData } from '../authentication/helpers'
import { ReceiptIOS } from 'src/services/iap'
import { PushNotificationRegistration } from 'src/helpers/push-notifications'
import DeviceInfo from 'react-native-device-info'

/**
 * this is ostensibly used to get the legacy data from the old GCE app
 * `Settings` only works on iOS but we only ever had a legacy app on iOS
 * and not Android.
 */
const createSyncCacheIOS = <T = any>(key: string) => ({
    set: (value: T) => Settings.set({ [key]: value }),
    get: (): T | undefined => Settings.get(key),
    reset: (): void => Settings.set({ [key]: void 0 }),
})

const legacyCASUsernameCache = createSyncCacheIOS<string>(
    LEGACY_SUBSCRIBER_ID_USER_DEFAULT_KEY,
)

const legacyCASPasswordCache = createSyncCacheIOS<string>(
    LEGACY_SUBSCRIBER_POSTCODE_USER_DEFAULT_KEY,
)

const legacyCASExpiryCache = (bundleId: string) =>
    createSyncCacheIOS<CasExpiry>(LEGACY_CAS_EXPIRY_USER_DEFAULTS_KEY(bundleId))

/**
 * A wrapper around AsyncStorage, with json handling and standardizing the interface
 * between AsyncStorage and the keychain helper below
 */
const createAsyncCache = <T extends object | string>(key: string) => ({
    set: (value: T) => AsyncStorage.setItem(key, JSON.stringify(value)),
    get: (): Promise<T | null> =>
        AsyncStorage.getItem(key).then(value => value && JSON.parse(value)),
    reset: (): Promise<boolean> =>
        AsyncStorage.removeItem(key).then(() => true),
})

const casDataCache = createAsyncCache<CasExpiry>('cas-data-cache')

const userDataCache = createAsyncCache<UserData>('user-data-cache')

const iapReceiptCache = createAsyncCache<ReceiptIOS>('iap-receipt-cache')

const pushNotificationRegistrationCache = createAsyncCache<
    PushNotificationRegistration
>('push-notification-registration-cache')

const cacheClearCache = createAsyncCache<string>('cacheClear')

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
const signOutIdentity = (
    userAccessTokenKeychainImpl = userAccessTokenKeychain,
    membershipAccessTokenKeychainImpl = membershipAccessTokenKeychain,
    userDataCacheImpl = userDataCache,
    legacyUserAccessTokenKeychainImpl = _legacyUserAccessTokenKeychain,
): Promise<boolean> =>
    Promise.all([
        userAccessTokenKeychainImpl.reset(),
        membershipAccessTokenKeychainImpl.reset(),
        userDataCacheImpl.reset(),
        legacyUserAccessTokenKeychainImpl.reset(),
    ]).then(all => all.every(_ => _))

const DEV_clearCASCaches = () =>
    Promise.all([
        signOutIdentity(),
        DeviceInfo.getBuildId().then(buildId =>
            legacyCASExpiryCache(buildId).reset(),
        ),
        legacyCASPasswordCache.reset(),
        legacyCASUsernameCache.reset(),
        casCredentialsKeychain.reset(),
        casDataCache.reset(),
    ])

export {
    userAccessTokenKeychain,
    membershipAccessTokenKeychain,
    casCredentialsKeychain,
    signOutIdentity,
    casDataCache,
    userDataCache,
    pushNotificationRegistrationCache,
    getLegacyUserAccessToken,
    legacyCASExpiryCache,
    legacyCASUsernameCache,
    legacyCASPasswordCache,
    _legacyUserAccessTokenKeychain,
    iapReceiptCache,
    cacheClearCache,
    DEV_clearCASCaches,
}
