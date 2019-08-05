import { Settings } from '../settings'

/*
Default settings.
This is a bit of a mess
*/
export const backends = [
    {
        title: 'PROD published',
        value: 'https://editions-store.s3-eu-west-1.amazonaws.com/',
    },
    {
        title: 'PROD preview',
        value: 'https://d2cf1ljtg904cv.cloudfront.net/',
    },
    {
        title: 'CODE published',
        value: 'https://editions-store-code.s3-eu-west-1.amazonaws.com/',
    },
    {
        title: 'CODE preview',
        value: 'https://d2mztzjulnpyb8.cloudfront.net/',
    },
    {
        title: 'DEV',
        value: 'http://localhost:3131/',
    },
] as const

export const notificationServiceRegister = {
    prod: 'https://notifications.guardianapis.com/device/register',
    code: 'https://notifications.code.dev-guardianapis.com/device/register',
}

export const defaultSettings: Settings = {
    apiUrl: backends[0].value,
    isUsingProdDevtools: false,
    hasOnboarded: false,
    gdprAllowPerformance: null,
    gdprAllowFunctionality: null,
    notificationServiceRegister: __DEV__
        ? notificationServiceRegister.code
        : notificationServiceRegister.prod,
}
