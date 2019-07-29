import AsyncStorage from '@react-native-community/async-storage'
import { defaultSettings } from './settings/defaults'
import versionInfo from '../version-info.json'
/*
Consent switches can be 'unset' or null
*/
export type GdprSwitchSetting = null | boolean
export interface GdprSwitchSettings {
    gdprAllowPerformance: GdprSwitchSetting
    gdprAllowFunctionality: GdprSwitchSetting
}
export const gdprSwitchSettings: (keyof GdprSwitchSettings)[] = [
    'gdprAllowPerformance',
    'gdprAllowFunctionality',
]

interface DevSettings {
    apiUrl: string
    isUsingProdDevtools: boolean
}

interface UserSettings {
    hasOnboarded: boolean
}

export interface Settings
    extends GdprSwitchSettings,
        UserSettings,
        DevSettings {}

/*
we can only store strings to memory
so we need to convert them
*/
export type UnsanitizedSetting = Settings[keyof Settings]
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

export const getVersionInfo = () => {
    return versionInfo as { version: string; commitId: string }
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

export const getAllSettings = async (): Promise<Settings> => {
    const settings = await Promise.all(
        (Object.keys(defaultSettings) as (keyof typeof defaultSettings)[]).map(
            key =>
                getSetting(key).then(value => ({
                    key,
                    value,
                })),
        ),
    )
    return settings.reduce(
        (acc, { key, value }) => ({ ...acc, [key]: value }),
        {} as Settings,
    )
}

export const storeSetting = (
    setting: keyof Settings,
    value: UnsanitizedSetting,
) => {
    AsyncStorage.setItem('@Setting_' + setting, sanitize(value))
}

export const shouldShowOnboarding = (settings: Settings) =>
    !settings.hasOnboarded
