import { format } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { Platform } from 'react-native';
import { languageLocale } from './locale';

const londonTime = (time?: string | number) => {
	if (time != null) return zonedTimeToUtc(time, 'Europe/London');
	return utcToZonedTime(new Date(), 'Europe/London');
};

const localDate = (date: Date): string => {
	if (Platform.OS === 'ios') {
		return date.toLocaleDateString(languageLocale);
	} else {
		// toLocaleDateString is not a reliable way of getting the format we need on android
		return languageLocale === 'en-US'
			? format(date, 'MM/DD/YYYY')
			: format(date, 'DD/MM/YYYY');
	}
};

export { londonTime, localDate };
