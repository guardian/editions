import React, { createContext, useContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-community/async-storage'

interface Settings {
    apiUrl: string
}
const defaultSettings: Settings = {
    apiUrl: 'https://editions-api.gutools.co.uk',
}

type StateContext = [Settings, (setting: keyof Settings, value: string) => void]

const useSettings = (): StateContext => {
    const [state, setState] = useState(defaultSettings)
    const setSetting = (setting: keyof Settings, value: string) => {
        setState({ [setting]: value })
        AsyncStorage.setItem('@setting-' + setting, value)
    }
    useEffect(() => {
        for (let setting of Object.keys(state)) {
            AsyncStorage.getItem('@setting-' + setting).then(value => {
                //@ts-ignore
                setState({ [setting]: value })
            })
        }
    }, [])
    return [state, setSetting]
}

export const StateContext = createContext<StateContext>([
    defaultSettings,
    (..._) => {
        throw new Error('Context used without context provider')
    },
])

export const StateProvider = ({ children }: { children: React.ReactNode }) => (
    <StateContext.Provider value={useSettings()}>
        {children}
    </StateContext.Provider>
)
export const useStateValue = (): StateContext => useContext(StateContext)
