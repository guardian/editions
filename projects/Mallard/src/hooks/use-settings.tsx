import React, { createContext, useContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-community/async-storage'

interface Settings {
    apiUrl: string
}
type SettingsContext = [
    Settings,
    (setting: keyof Settings, value: string) => void
]

const defaultSettings: Settings = {
    apiUrl: 'https://editions-api.gutools.co.uk',
}

const useStoredSettings = (): SettingsContext => {
    const [state, setState] = useState(defaultSettings)
    const setSetting = (setting: keyof Settings, value: string) => {
        setState({ [setting]: value })
        AsyncStorage.setItem('@setting-' + setting, value)
    }
    useEffect(() => {
        for (let setting of Object.keys(state)) {
            AsyncStorage.getItem('@setting-' + setting).then(value => {
                //@ts-ignore
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

export const SettingsProvider = ({
    children,
}: {
    children: React.ReactNode
}) => (
    <SettingsContext.Provider value={useStoredSettings()}>
        {children}
    </SettingsContext.Provider>
)
export const useSettings = (): SettingsContext => useContext(SettingsContext)
