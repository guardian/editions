import { Settings } from '../settings'
import { Platform } from 'react-native'

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

const storeDetails = {
    ios: 'itms-apps://itunes.apple.com/app/id452707806',
    android: 'market://details?id=com.guardian.editions',
}

const contentPrefix = 'daily-edition'

export const defaultSettings: Settings = {
    apiUrl,
    isUsingProdDevtools: false,
    hasOnboarded: false,
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
    contentPrefix,
    issuesPath: `/issues`,
    storeDetails,
    senderId: __DEV__ ? senderId.code : senderId.prod,
}

export const isPreview = (apiUrl: Settings['apiUrl']): boolean => {
    const backend = backends.find(backend => backend.value === apiUrl)
    return (backend && backend.preview) || false
}
