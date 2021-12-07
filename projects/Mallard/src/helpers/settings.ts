import AsyncStorage from '@react-native-community/async-storage';
import { defaultSettings } from './settings/defaults';

export const SETTINGS_KEY_PREFIX = '@Setting_';

export interface DevSettings {
	apiUrl: string;
	notificationServiceRegister: string;
	cacheClearUrl: string;
	deprecationWarningUrl: string;
	editionsUrl: string;
	storeDetails: {
		ios: string;
		android: string;
	};
	websiteUrl: string;
	issuesPath: string;
	senderId: string;
	logging: string;
}

export type Settings = DevSettings;

/*
we can only store strings to memory
so we need to convert them
*/
export type UnsanitizedSetting = Settings[keyof Settings];
const sanitize = (value: UnsanitizedSetting): string => {
	if (typeof value !== 'string') {
		return JSON.stringify(value);
	}
	return value;
};
const unsanitize = (value: string): UnsanitizedSetting => {
	try {
		return JSON.parse(value);
	} catch {
		return value;
	}
};

export const getSetting = <S extends keyof Settings>(
	setting: S,
): Promise<Settings[S]> => {
	return AsyncStorage.getItem(SETTINGS_KEY_PREFIX + setting).then((item) => {
		if (!item) {
			return defaultSettings[setting];
		}
		return unsanitize(item) as Settings[S];
	});
};

export const storeSetting = (
	setting: keyof Settings,
	value: UnsanitizedSetting,
) => AsyncStorage.setItem(SETTINGS_KEY_PREFIX + setting, sanitize(value));
