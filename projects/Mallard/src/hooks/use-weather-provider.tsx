import React, { createContext, useState, useEffect, useContext } from 'react'

interface WeatherState {
    isWeatherShown: boolean,
    setIsWeatherShown: (setting: boolean) => void
}

const initialState: WeatherState = {
    isWeatherShown: true,
    setIsWeatherShown:  () => {},
}

const WeatherContext = createContext(initialState)

export const WeatherProvider = ({ children }: { children: React.ReactNode }) => {
    const [isWeatherShown, setWeatherShown] = useState<boolean>(true)
  
    const setIsWeatherShown = (setting: boolean) => {
        setWeatherShown(setting)
    }
    
    return (
        <WeatherContext.Provider
            value={{
                isWeatherShown,
                setIsWeatherShown
            }}
        >
            {children}
        </WeatherContext.Provider>
    )
}

export const useIsWeatherShown = () => ({
    isWeatherShown: useContext(WeatherContext).isWeatherShown,
    setIsWeatherShown: useContext(WeatherContext).setIsWeatherShown,
})

