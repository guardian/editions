import { Settings } from '../settings'

/*
Default settings.
This is a bit of a mess
*/
export const backends = [
    {
        title: 'PROD',
        value: 'https://d2cf1ljtg904cv.cloudfront.net/',
    },
    {
        title: 'CODE',
        value: 'https://d2mztzjulnpyb8.cloudfront.net/',
    },
    {
        title: 'DEV',
        value: 'http://localhost:3131/',
    },
]

export const notificationService = {
    prod: 'https://notifications.guardianapis.com/',
    code: 'https://notifications.code.dev-guardianapis.com/'
}


export const defaultSettings: Settings = {
    apiUrl: backends[0].value,
    isUsingProdDevtools: false,
    hasOnboarded: false,
    gdprAllowPerformance: null,
    gdprAllowFunctionality: null,
    notificationService: notificationService.code
}

