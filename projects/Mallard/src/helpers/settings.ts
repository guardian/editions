import { AsyncStorage } from 'react-native'
export interface Settings {
    apiUrl: string
    isUsingProdDevtools: boolean
}

/* 
we can only store strings to memory 
so we need to convert them
*/
type UnsanitizedSetting = Settings[keyof Settings]
const sanitize = (value: UnsanitizedSetting): string => {
    if (typeof value !== 'string') {
        return JSON.stringify(value)
    }
    return value
}
const unsanitize = (value: string): UnsanitizedSetting => {
    try {
        return JSON.parse(value)
    } catch {
        return value
    }
}

/*
Default settings.
This is a bit of a mess
*/
export const backends = [
    {
        title: 'PROD',
        value: 'https://d2cf1ljtg904cv.cloudfront.net',
    },
    {
        title: 'CODE',
        value: 'https://d2mztzjulnpyb8.cloudfront.net',
    },
    { title: 'Live backend', value: 'https://editions-api.gutools.co.uk' },
    { title: 'Localhost', value: 'https://localhost:3131' },
]

export const defaultSettings: Settings = {
    apiUrl: backends[0].value,
    isUsingProdDevtools: false,
}

/* 
getters & setters
*/
export const getSetting = (setting: keyof Settings) =>
    AsyncStorage.getItem('@Setting_' + setting).then(item => {
        if (!item) {
            return defaultSettings[setting]
        }
        return unsanitize(item)
    })

export const storeSetting = (
    setting: keyof Settings,
    value: string | boolean,
) => {
    return AsyncStorage.setItem('@Setting_' + setting, sanitize(value))
}
