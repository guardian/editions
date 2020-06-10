import { Settings } from '../settings'
import { Platform } from 'react-native'
import { locale } from '../locale'

/*
Default settings.
This is a bit of a mess
*/
export const backends = [
    {
        title: 'PROD published',
        value: 'https://editions.guardianapis.com/',
        preview: false,
    },
    {
        title: 'PROD proofed',
        value: 'https://editions-proof-prod.s3-eu-west-1.amazonaws.com/',
        preview: false,
    },
    {
        title: 'PROD preview',
        value: 'https://preview.editions.guardianapis.com/',
        preview: true,
    },
    {
        title: 'CODE published',
        value: 'https://editions.code.dev-guardianapis.com/',
        preview: false,
    },
    {
        title: 'CODE proofed',
        value: 'https://editions-proof-code.s3-eu-west-1.amazonaws.com/',
        preview: false,
    },
    {
        title: 'CODE preview',
        value: 'https://preview.editions.code.dev-guardianapis.com/',
        preview: true,
    },
    {
        title: 'DEV',
        value: 'http://localhost:3131/',
        preview: true,
    },
] as {
    title: string
    value: string
    preview: boolean
}[]

export const editions = {
    daily: 'daily-edition',
    ausWeekly: 'australian-edition',
    usWeekly: 'american-edition',
    dummy: 'the-dummy-edition',
    training: 'training-edition',
}

const localeToEdition = new Map<string, string>()
localeToEdition.set('en_AU', editions.ausWeekly)
localeToEdition.set('en_US', editions.usWeekly)
localeToEdition.set('en_GB', editions.daily)

export const notificationServiceRegister = {
    prod: 'https://notifications.guardianapis.com/device/register',
    code: 'https://notifications.code.dev-guardianapis.com/device/register',
}

export const notificationEdition = {
    ios: 'ios-edition',
    android: 'android-edition',
}

const notificationTrackingReceivedEndpoints = {
    prod: 'https://mobile-events.guardianapis.com/notification/received',
    code:
        'https://mobile-events.code.dev-guardianapis.com/notification/received',
}

const notificationTrackingDownloadedEndpoints = {
    prod: 'https://mobile-events.guardianapis.com/notification/downloaded',
    code:
        'https://mobile-events.code.dev-guardianapis.com/notification/downloaded',
}

export const senderId = {
    prod: '493559488652',
    code: '43377569438',
}

export const notificationTrackingUrl = (
    notificationId: string,
    type: 'received' | 'downloaded',
) => {
    const edition =
        Platform.OS === 'ios'
            ? notificationEdition.ios
            : notificationEdition.android

    const params = `?notificationId=${notificationId}&platform=${edition}`

    const urlType =
        type === 'received'
            ? notificationTrackingReceivedEndpoints
            : notificationTrackingDownloadedEndpoints

    const url = __DEV__ ? urlType.code : urlType.prod

    return `${url}${params}`
}

const apiUrl = backends[0].value

const edition = localeToEdition.has(locale)
    ? localeToEdition.get(locale)
    : editions.daily
// const edition = editions.daily

const storeDetails = {
    ios: 'itms-apps://itunes.apple.com/app/id452707806',
    android: 'market://details?id=com.guardian.editions',
}

export const defaultSettings: Settings = {
    apiUrl,
    edition: edition || editions.daily,
    isUsingProdDevtools: false,
    gdprAllowEssential: true, // essential defaults to true and not switchable
    gdprAllowPerformance: null,
    gdprAllowFunctionality: null,
    gdprConsentVersion: null,
    gdprAllowOphan: true, // 'essential' so defaults to true and not switchable
    gdprAllowSentry: null,
    gdprAllowFacebookLogin: null,
    gdprAllowGoogleLogin: null,
    notificationServiceRegister: __DEV__
        ? notificationServiceRegister.code
        : notificationServiceRegister.prod,
    cacheClearUrl: apiUrl + 'cache-clear',
    deprecationWarningUrl: apiUrl + 'deprecation-warning',
    issuesPath: `/issues`,
    storeDetails,
    senderId: __DEV__ ? senderId.code : senderId.prod,
    isWeatherShown: true,
    wifiOnlyDownloads: false,
    maxAvailableEditions: 7,
    logging: __DEV__
        ? 'https://editions-logging.code.dev-guardianapis.com/log/mallard'
        : 'https://editions-logging.guardianapis.com/log/mallard',
}

export const isPreview = (apiUrl: Settings['apiUrl']): boolean => {
    const backend = backends.find(backend => backend.value === apiUrl)
    return (backend && backend.preview) || false
}
