import {
	addDays,
	format as dfnsFormat,
	differenceInDays,
	isBefore,
	subDays,
} from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import moment from 'moment-timezone';
import { Platform } from 'react-native';
import { languageLocale } from 'src/helpers/locale';

const londonTime = (time?: string | number) => {
	if (time != null) return moment.tz(time, 'Europe/London');
	return moment.tz('Europe/London');
};

const londonTimeAsDate = (): Date =>
	zonedTimeToUtc(new Date().toISOString(), 'Europe/London');

const localDate = (date: Date): string => {
	if (Platform.OS === 'ios') {
		return date.toLocaleDateString(languageLocale);
	} else {
		// toLocaleDateString is not a reliable way of getting the format we need on android
		return languageLocale === 'en-US'
			? dfnsFormat(date, 'MM/dd/yyyy')
			: dfnsFormat(date, 'dd/MM/yyyy');
	}
};

const format = (date: Date, fomattedString: string) =>
	dfnsFormat(date, fomattedString);

const isLondonTimeBefore = (date: Date) => isBefore(londonTimeAsDate(), date);

const now = new Date();

export {
	addDays,
	differenceInDays,
	format,
	isLondonTimeBefore,
	localDate,
	londonTime,
	londonTimeAsDate,
	now,
	subDays,
};
