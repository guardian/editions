import { AsyncStorage } from 'react-native'

export interface Settings {
    apiUrl: string
}

export const defaultSettings: Settings = {
    apiUrl: 'https://editions.gutools.co.uk',
}

const getSetting = (setting: keyof Settings) =>
    AsyncStorage.getItem('@Setting_' + setting).then(item => {
        if (item) return item
        else return defaultSettings[setting]
    })
const storeSetting = async (setting: keyof Settings, value: string) => {
    const r = await AsyncStorage.setItem('@Setting_' + setting, value)
    alert('set' + (await getSetting(setting)))
    return r
}

export { getSetting, storeSetting }
