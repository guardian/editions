import React, { createContext, useState, useEffect, useContext } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import { eventEmitter } from 'src/helpers/event-emitter'
import { getDefaultEditionSlug } from 'src/hooks/use-edition-provider'
import { largeDeviceMemory } from 'src/hooks/use-config-provider'

const KEY = '@weatherLowRAMCheck'
const EDITIONCHECKKEY = '@weatherEditionCheck'

interface WeatherState {
    isWeatherShown: boolean
    setIsWeatherShown: (setting: boolean) => void
}

const initialState: WeatherState = {
    isWeatherShown: true,
    setIsWeatherShown: () => {},
}

const WeatherContext = createContext(initialState)

export const WeatherProvider = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const [isWeatherShown, setWeatherShown] = useState<boolean>(true)
    const setIsWeatherShown = (setting: boolean) => {
        setWeatherShown(setting)
    }

    useEffect(() => {
        async function shouldWeatherBeShown() {
            const weatherLowRamCheck = await AsyncStorage.getItem(KEY)
            const editionWeatherCheck = await AsyncStorage.getItem(
                EDITIONCHECKKEY,
            )
            const defaultEdition = await getDefaultEditionSlug()
            if (!weatherLowRamCheck) {
                const largeRAM = await largeDeviceMemory()
                await AsyncStorage.setItem(KEY, 'true')
                !largeRAM && setIsWeatherShown(false)
            }
            if (
                !editionWeatherCheck &&
                defaultEdition &&
                defaultEdition !== 'daily-edition'
            ) {
                await AsyncStorage.setItem(EDITIONCHECKKEY, 'true')
                setIsWeatherShown(false)
            }
        }

        eventEmitter.on('editionCachesSet', () => {
            shouldWeatherBeShown()
        })
    }, [])

    return (
        <WeatherContext.Provider
            value={{
                isWeatherShown,
                setIsWeatherShown,
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
