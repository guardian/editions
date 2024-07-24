import AsyncStorage from '@react-native-async-storage/async-storage';
import { largeDeviceMemory } from '../hooks/use-config-provider';
import { getDefaultEditionSlug } from '../hooks/use-edition-provider';
import type { IsWeatherShown } from '../hooks/use-weather-provider';
import { errorService } from '../services/errors';

// Purpose: To hide the weather on the first load unless the user turns it on
// Intended for use on lower powered devices and for users who do not use the UK Daily edition as their default edition

const KEY = '@weatherLowRAMCheck';
const EDITIONCHECKKEY = '@weatherEditionCheck';

const weatherHider = async (
	setIsWeatherShown: IsWeatherShown['setIsWeatherShown'],
) => {
	try {
		const weatherLowRamCheck = await AsyncStorage.getItem(KEY);
		const editionWeatherCheck = await AsyncStorage.getItem(EDITIONCHECKKEY);
		const defaultEdition = await getDefaultEditionSlug();
		if (!weatherLowRamCheck) {
			const largeRAM = await largeDeviceMemory();
			await AsyncStorage.setItem(KEY, 'true');
			!largeRAM && setIsWeatherShown(false);
		}
		if (
			!editionWeatherCheck &&
			defaultEdition &&
			defaultEdition !== 'daily-edition'
		) {
			await AsyncStorage.setItem(EDITIONCHECKKEY, 'true');
			setIsWeatherShown(false);
		}
	} catch (e) {
		errorService.captureException(e);
	}
};

export { weatherHider };
