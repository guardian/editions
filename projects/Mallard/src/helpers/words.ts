import { isInBeta } from './release-stream'
import { Platform } from 'react-native'

export const REQUEST_INVALID_RESPONSE_STATE = 'Request failed'
export const REQUEST_INVALID_RESPONSE_VALIDATION = 'Failed to parse data'
export const LOCAL_JSON_INVALID_RESPONSE_VALIDATION =
    'Failed to parse local data'

export const APP_DISPLAY_NAME = 'Daily Edition'
export const FEEDBACK_EMAIL = 'editions.product@theguardian.com'
export const COOKIE_LINK = 'https://www.theguardian.com/info/cookies'
export const PRIVACY_LINK = 'https://www.theguardian.com/info/privacy'
export const IOS_BETA_EMAIL = 'daily.ios.beta@theguardian.com'
export const ANDROID_BETA_EMAIL = 'daily.android.beta@theguardian.com'
export const ISSUE_EMAIL = 'daily.feedback@theguardian.com'
export const SUBSCRIPTION_EMAIL = 'subscriptions@theguardian.com'
export const READERS_EMAIL = 'guardian.readers@theguardian.com'
export const APPS_FEEDBACK_EMAIL = 'daily.feedback@theguardian.com'

export const CONNECTION_FAILED_ERROR = `Connection failed`
export const CONNECTION_FAILED_SUB_ERROR = `Let's try and get your issue`
export const CONNECTION_FAILED_AUTO_RETRY =
    'Next time you go online, we will download your issue'
export const GENERIC_ERROR = `Sorry! This didn't work`
export const GENERIC_AUTH_ERROR = `Something went wrong`
export const GENERIC_FATAL_ERROR = `Sorry! We broke the app. Can you email us at ${FEEDBACK_EMAIL} and tell us what happened?`

export const DIAGNOSTICS_TITLE = 'Found a bug?'
export const DIAGNOSTICS_REQUEST = `Would you like us to include diagnostic information to help answer your query?${
    isInBeta()
        ? `

${Platform.select({
    ios:
        'If you would like to switch back from this beta back to the general app you can delete this app and reinstall it from the app store.',
    android:
        'If you would like to switch back from this beta back to the general app you can find this app on the Play Store, leave the beta from the Play Store page, uninstall the app and then reinstall the app.',
})}`
        : ``
}`

export const ERR_404_MISSING_PROPS = `Couldn't find a path to this item`
export const ERR_404_REMOTE = `Couldn't find item`

export const PREFS_SAVED_MSG = 'Your preferences are saved.'

export const PRIVACY_SETTINGS_HEADER_TITLE = 'Privacy Settings'
export const PRIVACY_POLICY_HEADER_TITLE = 'Privacy Policy'
export const REFRESH_BUTTON_TEXT = 'Refresh'
export const DOWNLOAD_ISSUE_MESSAGE_OFFLINE = `You're currently offline. You can download it when you go online`
