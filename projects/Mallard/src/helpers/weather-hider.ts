import ApolloClient from 'apollo-client'
import { largeDeviceMemory } from 'src/hooks/use-config-provider'
import { setIsWeatherShown } from './settings/setters'
import AsyncStorage from '@react-native-community/async-storage'
import { errorService } from 'src/services/errors'

// Purpose: To hide the weahter on the first load unless the user turns it on
// Intended for use on lower powered devices

const KEY = '@weatherLowRAMCheck'

const weatherHider = async (client: ApolloClient<object>) => {
    try {
        const weatherLowRamCheck = await AsyncStorage.getItem(KEY)
        if (!weatherLowRamCheck) {
            const largeRAM = await largeDeviceMemory()
            await AsyncStorage.setItem(KEY, 'true')
            !largeRAM && setIsWeatherShown(client, false)
        }
    } catch (e) {
        errorService.captureException(e)
    }
}

export { weatherHider }
