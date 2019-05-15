import React, { createContext, useContext, useState, useEffect } from 'react'

import {
    getSetting,
    storeSetting,
    Settings,
    defaultSettings,
} from '../helpers/settings'

type SettingsContext = [
    Settings,
    (setting: keyof Settings, value: string) => void
]

const useStoredSettings = (): SettingsContext => {
    const [state, setState] = useState(defaultSettings)
    const setSetting = (setting: keyof Settings, value: string) => {
        setState({ [setting]: value })
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

const SettingsContext = createContext<SettingsContext>([
    defaultSettings,
    (..._) => {
        throw new Error('Context used without context provider')
    },
])

const SettingsProvider = ({ children }: { children: React.ReactNode }) => (
    <SettingsContext.Provider value={useStoredSettings()}>
        {children}
    </SettingsContext.Provider>
)
const useSettings = (): SettingsContext => useContext(SettingsContext)

export { SettingsProvider, useSettings }
