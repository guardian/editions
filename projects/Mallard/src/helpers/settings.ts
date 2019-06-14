import { AsyncStorage } from 'react-native'
export interface Settings {
    apiUrl: string
    hasLiveDevMenu: boolean
}

/* 
we can only store strings to memory 
so we need to convert them
*/
const [TRUE, FALSE] = ['TRUE', 'FALSE']
type UnsanitizedSetting = Settings[keyof Settings]
const sanitize = (value: UnsanitizedSetting): string => {
    if (value === true) {
        value = TRUE
    }
    if (value === false) {
        value = FALSE
    }
    return value
}
const unsanitize = (value: string): UnsanitizedSetting => {
    if (value === TRUE) {
        return true
    }
    if (value === FALSE) {
        return false
    }
    return value
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
    hasLiveDevMenu: false,
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
