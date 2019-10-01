import { Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import Config from 'react-native-config'

const {
    ID_API_URL,
    MEMBERS_DATA_API_URL,
    ID_ACCESS_TOKEN,
    ITUNES_CONNECT_SHARED_SECRET,
    USE_SANDBOX_IAP: ENV_USE_SANDBOX_IAP,
    ANDROID_RELEASE_STREAM,
} = Config

const FACEBOOK_CLIENT_ID = '528503751025697'

const AUTH_TTL = 86400000 // ms in a day

const CAS_ENDPOINT_URL = 'https://content-auth.guardian.co.uk/subs'

const GOOGLE_CLIENT_ID =
    Platform.OS === 'android'
        ? __DEV__
            ? '774465807556-5oq58e8pnfqn9sptsivri5kcs9mthef9'
            : '774465807556-cjat38acttpl7md4nfc4pfediouh7v97'
        : '774465807556-kgaj5an4pc4fmr3svp5nfpulekc1rl3n'

const LEGACY_SUBSCRIBER_ID_USER_DEFAULT_KEY = 'printSubscriberID'
const LEGACY_SUBSCRIBER_POSTCODE_USER_DEFAULT_KEY = 'printSubscriberPostcode'
const LEGACY_CAS_EXPIRY_USER_DEFAULTS_KEY = `${DeviceInfo.getBundleId().then(
    bundleId => bundleId,
)}_expiryDict`

// this allows us to ensure some prod build use the sanboxed IAP endpoints
// e.g. the beta builds for testflight
// we should never be using sandbox for __DEV__ builds, hence the `||`
const USE_SANDBOX_IAP = ENV_USE_SANDBOX_IAP || __DEV__ ? true : false

export {
    CAS_ENDPOINT_URL,
    ID_API_URL,
    MEMBERS_DATA_API_URL,
    ID_ACCESS_TOKEN,
    FACEBOOK_CLIENT_ID,
    GOOGLE_CLIENT_ID,
    AUTH_TTL,
    LEGACY_SUBSCRIBER_ID_USER_DEFAULT_KEY,
    LEGACY_SUBSCRIBER_POSTCODE_USER_DEFAULT_KEY,
    LEGACY_CAS_EXPIRY_USER_DEFAULTS_KEY,
    ITUNES_CONNECT_SHARED_SECRET,
    USE_SANDBOX_IAP,
    ANDROID_RELEASE_STREAM,
}
