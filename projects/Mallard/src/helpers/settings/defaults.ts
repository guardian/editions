import { Settings } from '../settings'

/*
Default settings.
This is a bit of a mess
*/
export const backends = [
    {
        title: 'PROD published',
        value: 'https://editions-store.s3-eu-west-1.amazonaws.com/',
        preview: false,
    },
    {
        title: 'PROD preview',
        value: 'https://d2cf1ljtg904cv.cloudfront.net/',
        preview: true,
    },
    {
        title: 'CODE published',
        value: 'https://editions-store-code.s3-eu-west-1.amazonaws.com/',
        preview: false,
    },
    {
        title: 'CODE preview',
        value: 'https://d2mztzjulnpyb8.cloudfront.net/',
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

const apiUrl = backends[0].value

export const defaultSettings: Settings = {
    apiUrl,
    isUsingProdDevtools: false,
    hasOnboarded: false,
    gdprAllowPerformance: null,
    gdprAllowFunctionality: null,
    notificationServiceRegister: __DEV__
        ? notificationServiceRegister.code
        : notificationServiceRegister.code,
    zipUrl: apiUrl + 'zips/',
}

export const isPreview = (apiUrl: Settings['apiUrl']): boolean => {
    const backend = backends.find(backend => backend.value === apiUrl)
    return (backend && backend.preview) || false
}
