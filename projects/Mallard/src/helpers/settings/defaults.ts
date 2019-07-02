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
]

export const defaultSettings: Settings = {
    apiUrl: backends[0].value,
    isUsingProdDevtools: false,
    hasOnboarded: false,
    gdprAllowPerformance: null,
    gdprAllowTracking: null,
}
