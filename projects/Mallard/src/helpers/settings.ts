import { AsyncStorage } from 'react-native'

export interface Settings {
    apiUrl: string
}

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
}

const getSetting = (setting: keyof Settings) =>
    AsyncStorage.getItem('@Setting_' + setting).then(item => {
        if (item) return item
        else return defaultSettings[setting]
    })
const storeSetting = (setting: keyof Settings, value: string) => {
    return AsyncStorage.setItem('@Setting_' + setting, value)
}

export { getSetting, storeSetting }
