import { isInBeta } from './release-stream'
import { Platform } from 'react-native'

export const REQUEST_INVALID_RESPONSE_STATE = 'Request failed'
export const REQUEST_INVALID_RESPONSE_VALIDATION = 'Failed to parse data'
export const LOCAL_JSON_INVALID_RESPONSE_VALIDATION =
    'Failed to parse local data'

export const FEEDBACK_EMAIL = 'daily.feedback@theguardian.com'
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
export const NOT_CONNECTED = 'You are not connected to the internet'
export const MANAGE_EDITIONS_TITLE = 'Manage Downloads'
export const WIFI_ONLY_DOWNLOAD = `You must be connected to wifi to download, you can change this under '${MANAGE_EDITIONS_TITLE}'`

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
export const CUSTOMER_HELP_EMAIL = 'customer.help@theguardian.com'

// Sign in modal
const SignIn = {
    title: 'Already a subscriber?',
    subtitle: 'Sign in with your subscriber details to continue',
    explainerTitle: 'Not subscribed yet?',
    explainerSubtitleEditions: `${Platform.select({
        ios:
            'Get the Editions app with a digital subscription from The Guardian website.',
        android:
            'Read the Editions app with a digital subscription from The Guardian.',
    })}`,
    explianerSubtitleDaily: `${Platform.select({
        ios:
            'Get the Daily with a digital subscription from The Guardian website.',

        android:
            'Read the Daily with a digital subscription from The Guardian.',
    })}`,
    freeTrial: 'Start your free 14 day trial',
}

// Failed sign in modal
const FailedSignIn = {
    appleRelayTitle: 'We are unable to verify your subscription',
    appleRelayBody: `We are unable to detect your subscription as it seems you chose not to share your email address with us. \n \nPlease try a different sign in method. You will need to use the same email address as your Digital subscription. Alternatively, use your subscriber ID.`,
    appleRelayRetry: 'Try alternative sign in method',
    title: 'Subscription not found',
    body: `We were unable to find a subscription associated with %email%. Try signing in with a different email or contact us at ${CUSTOMER_HELP_EMAIL}`,
    retryButtonTitle: 'Try a different email',
}

// Sub found modal
const SubFound = {
    title: 'Subscription found',
    subtitle: 'Enjoy the Guardian and thank you for your support',
}

// Sub not found modal
const SubNotFound = {
    title: 'Already a subscriber?',
    explainer: 'Not subscribed yet?',
    explainerSubtitle: `${Platform.select({
        ios:
            'To get a free trial with our digital subscription, visit our website',

        android: 'Get a free trial with our digital subscription',
    })}`,
    signIn: 'Sign in to activate',
    subscriberButton: 'Activate with subscriber ID',
}

// Auth switcher screen
const AuthSwitcherScreen = {
    title: 'Sign in to activate your subscription',
    nextButton: 'Next',
    invalidEmail: 'Please enter a valid email',
    emptyEmail: 'Please enter an email',
    invalidPassword: 'Invalid password',
    socialSignInDisabledTitle: '%signInName% sign-in disabled',
    socialSignInDisabledSubtitle:
        'You have disabled %signInName% sign-in. You can enable it in in Settings > Privacy Settings > Functional',
}

// Already Subscribed
const AlreadySubscribed = {
    title: 'Subscription Activation',
    subscriptionHeading: 'Guardian digital subscription/Digital + Print',
    appHeadingDaily: 'Daily Edition',
    appHeadingEditions: 'Guardian Editions',
    signInTitle: 'Sign in to activate',
    subscriberIdTitle: 'Activate with subscriber ID',
    restoreIapTitle: 'Restore App Store subscription',
    restoreErrorTitle: 'Verification error',
    restoreErrorSubtitle:
        'There was a problem whilst verifying your subscription',
    restoreMissingTitle: 'Subscription not found',
    restoreMissingSubtitle:
        'We were unable to find a subscription associated with your Apple ID',
}

// Consent Onboarding
export const ConsentOnboarding = {
    title: 'We care about your privacy',
    explainerTitle: 'This app is free of ads',
    optionsButton: 'My options',
    okayButton: "I'm okay with that",
}

export const Settings = {
    subscriptionDetails: 'Subscription details',
    alreadySubscribed: "I'm already subscribed",
    signIn: 'Sign in',
    signOut: 'Sign out',
    displayWeather: 'Display weather',
    manageDownloads: 'Manage downloads',
    signInTitle: "I'm already subscribed",
    privacySettings: 'Privacy settings',
    privacyPolicy: 'Privacy policy',
    termsAndConditions: 'Terms and conditions',
    help: 'Help',
    credits: 'Credits',
    version: 'Version',
}

export const ManageDownloads = {
    wifiOnlyTitle: 'Wifi-only',
    wifiOnlyExplainer: 'Issues will only be downloaded when Wi-Fi is available',
    availableDownloads: 'Available downloads',
    deleteDownloadsTitle: 'Delete all downloads',
    deleteDownloadsExplainer:
        'All downloaded issues will be deleted from your device but will still be available to download',
    deleteDownloadsAlertTitle: 'Are you sure you want to delete all downloads?',
    deleteDownloadsAlertSubtitle:
        'You will still be able to access them and download them again',
    cancel: 'Cancel',
    delete: 'Delete',
}

export const HomeScreen = {
    issuePickerTitle: 'Recent',
    issuePickerTitleSubtitle: 'Editions',
}

export const IssueListFooter = {
    manageDownloads: 'Manage downloads',
    goToLatestButton: 'Go to latest',
}

export const SubscriptionDetails = {
    title: 'Subscription Details',
    heading: 'Paper + digital subscription',
    iapHeadingDaily: 'Guardian Daily / App Store',
    iapHeadingEditions: 'Guardian Editions / App Store',
    loggedOutHeading: 'Not logged in',
    emailAddress: 'Email Address',
    userId: 'User ID',
    subscriptionType: 'Subscription type',
    expiryDate: 'Expiry date',
    subscriptionPrefix: 'Subscription prefix',
}

export const Weather = {
    useLocation: 'Use location',
    disabledLocationAlertTitle: 'Location services',
    disabledLocationAlertExplainer:
        'Location services are disabled in the device ' +
        'settings. Enable them to see location-based ' +
        'weather.',
    locationPermissionTitle: 'Location permission',
    locationPermissionExplainer:
        'Location permission is blocked in the device ' +
        'settings. Allow the app to access location to ' +
        'see location-based weather.',
    acceptLocationButton: 'Ok, show me the weather',
    cancelButton: 'No thanks',
}

export const DeprecateModal = {
    titleEditions: 'This version of the Editions app is no longer supported',
    titleDaily: 'This version of the Daily app is no longer supported',
    subtitle: 'Please go to the %storeLink% to update to the latest version',
}

export const WeatherConsentHtml = {
    contentDaily: `<h2>Location-based weather</h2>
    <p>
        This is a 3rd party service provided by AccuWeather. It works by taking
        your location coordinates and bringing the weather to you.
    </p>
    <ul>
        <li>
            The Daily app only collects your geolocation and Accuweather uses it
            for getting your weather forecast
        </li>
        <li>
            Your geolocation is not used for advertising or any other purposes
        </li>
        <li>
            Your geolocation is not linked to other identifiers such as your
            name or email address
        </li>
        <li>
            You can switch the weather feature on/off at any time on the app
            Settings
        </li>
        </ul>
        <p>
            For more information about how Accuweather uses your location,
            please check their
            <a href="https://www.accuweather.com/en/privacy"> privacy policy</a>
        </p>
    </ul>
`,
    contentEditions: `<h2>Location-based weather</h2>
<p>
    This is a 3rd party service provided by AccuWeather. It works by taking
    your location coordinates and bringing the weather to you.
</p>
<ul>
    <li>
        The Editions app only collects your geolocation and Accuweather uses it
        for getting your weather forecast
    </li>
    <li>
        Your geolocation is not used for advertising or any other purposes
    </li>
    <li>
        Your geolocation is not linked to other identifiers such as your
        name or email address
    </li>
    <li>
        You can switch the weather feature on/off at any time on the app
        Settings
    </li>
    </ul>
    <p>
        For more information about how Accuweather uses your location,
        please check their
        <a href="https://www.accuweather.com/en/privacy"> privacy policy</a>
    </p>
</ul>
`,
}

export const Copy = {
    signIn: SignIn,
    failedSignIn: FailedSignIn,
    subFound: SubFound,
    subNotFound: SubNotFound,
    alreadySubscribed: AlreadySubscribed,
    consentOnboarding: ConsentOnboarding,
    settings: Settings,
    manageDownloads: ManageDownloads,
    homeScreen: HomeScreen,
    issueListFooter: IssueListFooter,
    weather: Weather,
    subscriptionDetails: SubscriptionDetails,
    authSwitcherScreen: AuthSwitcherScreen,
    deprecateModal: DeprecateModal,
    weatherConsentHtml: WeatherConsentHtml,
}
