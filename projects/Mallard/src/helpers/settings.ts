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

export interface DevSettings {
    apiUrl: string
    isUsingProdDevtools: boolean
    notificationServiceRegister: string
    zipUrl: string
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
let callbacks: ((
    setting: keyof Settings,
    value: UnsanitizedSetting,
) => void)[] = []
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
export const onSettingChanged = (
    callback: (setting: keyof Settings, value: UnsanitizedSetting) => void,
) => {
    callbacks.push(callback)
    return () => {
        callbacks = callbacks.filter(item => item !== callback)
    }
}

export const storeSetting = (
    setting: keyof Settings,
    value: UnsanitizedSetting,
) => {
    AsyncStorage.setItem('@Setting_' + setting, sanitize(value), () => {
        for (let cb of callbacks) {
            cb(setting, value)
        }
    })
}

export const shouldShowOnboarding = (
    settings: Pick<Settings, 'hasOnboarded'>,
) => !settings.hasOnboarded

export type GdprSwitch = keyof GdprSwitchSettings

export const withConsent = async <T>(
    consentSwitch: GdprSwitch | null, // false allows conditionally ignoring consent
    {
        allow,
        deny,
    }: {
        allow: () => T
        deny: (wasSet: boolean) => T
    },
    getSettingImpl = getSetting,
) => {
    if (!consentSwitch) return allow()
    const allowed = await getSettingImpl(consentSwitch)
    return allowed ? allow() : deny(allowed === false)
}
