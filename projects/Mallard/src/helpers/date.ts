import { addDays, format as dfnsFormat, isBefore, subDays } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import moment from 'moment-timezone';
import { Platform } from 'react-native';
import { languageLocale } from './locale';

const londonTime = (date: Date) => utcToZonedTime(date, 'Europe/London');

const londonTimeAsDate = (): Date =>
	utcToZonedTime(new Date(), 'Europe/London');

const localDate = (date: Date): string => {
	if (Platform.OS === 'ios') {
		return date.toLocaleDateString(languageLocale);
	} else {
		// toLocaleDateString is not a reliable way of getting the format we need on android
		return languageLocale === 'en-US'
			? moment(date).format('MM/DD/YYYY')
			: moment(date).format('DD/MM/YYYY');
	}
};

const format = (date: Date, fomattedString: string) =>
	dfnsFormat(date, fomattedString);

const isLondonTimeBefore = (date: Date) => isBefore(londonTimeAsDate(), date);

const formatWeekday = (date: Date) => format(date, 'd');
const formatDayNumber = (date: Date) => format(date, 'iiii');
const formatMonth = (date: Date) => format(date, 'LLLL');

export {
	addDays,
	format,
	formatDayNumber,
	formatMonth,
	formatWeekday,
	isLondonTimeBefore,
	localDate,
	londonTime,
	londonTimeAsDate,
	subDays,
};
