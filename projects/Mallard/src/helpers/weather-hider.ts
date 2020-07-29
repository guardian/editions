import ApolloClient from 'apollo-client'
import { largeDeviceMemory } from 'src/hooks/use-config-provider'
import { setIsWeatherShown } from './settings/setters'
import AsyncStorage from '@react-native-community/async-storage'
import { errorService } from 'src/services/errors'
import { getDefaultEditionSlug } from 'src/hooks/use-edition-provider'

// Purpose: To hide the weahter on the first load unless the user turns it on
// Intended for use on lower powered devices and for users who do not use the daily edition as their default edition

const KEY = '@weatherLowRAMCheck'
const EDITIONCHECKKEY = '@weatherEditionCheck'

const weatherHider = async (client: ApolloClient<object>) => {
    try {
        const weatherLowRamCheck = await AsyncStorage.getItem(KEY)
        const editionWeatherCheck = await AsyncStorage.getItem(EDITIONCHECKKEY)
        const defaultEdition = await getDefaultEditionSlug()
        if (!weatherLowRamCheck) {
            const largeRAM = await largeDeviceMemory()
            await AsyncStorage.setItem(KEY, 'true')
            !largeRAM && setIsWeatherShown(client, false)
        }
        if (
            !editionWeatherCheck &&
            defaultEdition &&
            defaultEdition !== 'daily-edition'
        ) {
            await AsyncStorage.setItem(EDITIONCHECKKEY, 'true')
            setIsWeatherShown(client, false)
        }
    } catch (e) {
        errorService.captureException(e)
    }
}

export { weatherHider }
