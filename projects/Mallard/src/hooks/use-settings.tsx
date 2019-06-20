import React, { createContext, useContext, useState, useEffect } from 'react'

import {
    getSetting,
    storeSetting,
    Settings,
    defaultSettings,
} from 'src/helpers/settings'

type SettingsFromContext = [
    Settings,
    (setting: keyof Settings, value: Settings[keyof Settings]) => void
]

const useStoredSettings = (): SettingsFromContext => {
    const [state, setState] = useState(defaultSettings)
    const setSetting = (setting: keyof Settings, value: string | boolean) => {
        setState(settings => ({ ...settings, [setting]: value }))
        storeSetting(setting, value)
    }
    useEffect(() => {
        for (let setting of Object.keys(state)) {
            //@ts-ignore
            getSetting(setting).then(value => {
                setState(currentState => ({
                    ...currentState,
                    [setting]: value,
                }))
            })
        }
    }, [])
    return [state, setSetting]
}

const SettingsContext = createContext<SettingsFromContext>(
    {} as SettingsFromContext,
)

const SettingsProvider = ({ children }: { children: React.ReactNode }) => (
    <SettingsContext.Provider value={useStoredSettings()}>
        {children}
    </SettingsContext.Provider>
)
const useSettings = (): SettingsFromContext => useContext(SettingsContext)

export { SettingsProvider, useSettings }
