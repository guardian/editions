import AsyncStorage from '@react-native-community/async-storage'
import { Settings } from 'react-native'
import * as Keychain from 'react-native-keychain'
import {
    LEGACY_SUBSCRIBER_ID_USER_DEFAULT_KEY,
    LEGACY_SUBSCRIBER_POSTCODE_USER_DEFAULT_KEY,
} from 'src/constants'
import { CasExpiry } from 'src/services/content-auth-service'
import { ReceiptIOS } from 'src/authentication/services/iap'
import { PushNotificationRegistration } from 'src/helpers/push-notifications'
import { IdentityAuthData } from 'src/authentication/authorizers/IdentityAuthorizer'

/**
 * this is ostensibly used to get the legacy data from the old GCE app
 * `Settings` only works on iOS but we only ever had a legacy app on iOS
 * and not Android.
 */
const createSettingsCacheIOS = <T = any>(key: string) => ({
    set: async (value: T) => {
        Settings.set({ [key]: value })
    },
    get: async (): Promise<T | null> => Settings.get(key) || null,
    reset: async (): Promise<void> => {
        Settings.set({ [key]: null })
    },
})

const legacyCASUsernameCache = createSettingsCacheIOS<string>(
    LEGACY_SUBSCRIBER_ID_USER_DEFAULT_KEY,
)

const legacyCASPasswordCache = createSettingsCacheIOS<string>(
    LEGACY_SUBSCRIBER_POSTCODE_USER_DEFAULT_KEY,
)

/**
 * A wrapper around AsyncStorage, with json handling and standardizing the interface
 * between AsyncStorage and the keychain helper below
 */
const createAsyncCache = <T extends object | string>(key: string) => ({
    set: (value: T) => AsyncStorage.setItem(key, JSON.stringify(value)),
    get: (): Promise<T | null> =>
        AsyncStorage.getItem(key).then(value => value && JSON.parse(value)),
    reset: (): Promise<void> => AsyncStorage.removeItem(key),
})

const casDataCache = createAsyncCache<CasExpiry>('cas-data-cache')

const userDataCache = createAsyncCache<IdentityAuthData>('user-data-cache')

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
    get: () =>
        Keychain.getGenericPassword({ service }).then(val =>
            val ? val : null,
        ),
    set: async ({ username, token }: { username: string; token: string }) => {
        await Keychain.setGenericPassword(username, token, { service })
    },
    reset: async (): Promise<void> => {
        await Keychain.resetGenericPassword({ service })
    },
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

const legacyUserAccessTokenKeychain = {
    get: async (): ReturnType<typeof _legacyUserAccessTokenKeychain.get> => {
        const token = await _legacyUserAccessTokenKeychain.get()
        if (!token) return token

        return {
            ...token,
            password: JSON.parse(token.password).accessToken,
        }
    },
    set: async () => {
        /** noop, use the non-legacy cache */
    },
    reset: () => _legacyUserAccessTokenKeychain.reset(),
}

export {
    userAccessTokenKeychain,
    membershipAccessTokenKeychain,
    casCredentialsKeychain,
    casDataCache,
    userDataCache,
    pushNotificationRegistrationCache,
    legacyUserAccessTokenKeychain,
    legacyCASUsernameCache,
    legacyCASPasswordCache,
    iapReceiptCache,
    cacheClearCache,
}
