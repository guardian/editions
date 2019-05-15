import AsyncStorage from '@react-native-community/async-storage'

export interface Settings {
    apiUrl: string
}

export const defaultSettings: Settings = {
    apiUrl: 'https://editions-api.gutools.co.uk',
}

const getSetting = (setting: keyof Settings) =>
    AsyncStorage.getItem('@setting-' + setting).then(item => {
        if (item) return item
        else return defaultSettings[setting]
    })
const storeSetting = (setting: keyof Settings, value: string) =>
    AsyncStorage.setItem('@setting-' + setting, value)

export { getSetting, storeSetting }
