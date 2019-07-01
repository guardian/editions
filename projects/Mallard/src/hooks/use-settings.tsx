import React, { createContext, useContext, useState, useEffect } from 'react'

import { storeSetting, Settings, getAllSettings } from 'src/helpers/settings'

type SettingsFromContext = [
    Settings,
    (setting: keyof Settings, value: Settings[keyof Settings]) => void,
]

/**
 * Fetch settings stored in AsyncStorage on mount
 */
const useStoredSettings = (): SettingsFromContext | null => {
    const [settings, setSettings] = useState(null as Settings | null)
    const setSetting = (setting: keyof Settings, value: string | boolean) => {
        setSettings(settings => {
            if (!settings) {
                console.warn(
                    'Settings had not yet been fetched when trying to set a setting, ignoring setting update.',
                )
                return settings
            }
            return { ...settings, [setting]: value }
        })
        storeSetting(setting, value)
    }
    useEffect(() => {
        getAllSettings().then(s => setSettings(s))
    }, [])
    return settings && [settings, setSetting]
}

const SettingsContext = createContext<SettingsFromContext>(
    {} as SettingsFromContext,
)

const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
    const settings = useStoredSettings()
    return (
        // @TODO: do we need to render a loading state here, it's so quick that we probably don't?
        settings && (
            <SettingsContext.Provider value={settings}>
                {children}
            </SettingsContext.Provider>
        )
    )
}
const useSettings = (): SettingsFromContext => useContext(SettingsContext)

export { SettingsProvider, useSettings }
