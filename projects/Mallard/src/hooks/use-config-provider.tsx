import React, { createContext, useContext, useEffect, useState } from 'react';
import { Dimensions, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {
	isWeatherShownCache,
	maxAvailableEditionsCache,
	notificationsEnabledCache,
	wifiOnlyDownloadsCache,
} from 'src/helpers/storage';
import { errorService } from 'src/services/errors';
import { Breakpoints } from 'src/theme/breakpoints';

const oneGB = 1073741824;
interface ConfigState {
	largeDeviceMemeory: boolean;
	dimensions: {
		width: number;
		height: number;
		scale: number;
		fontScale: number;
	};
	notificationsEnabled: boolean;
	setNotifications: (setting: boolean) => Promise<void>;
	wifiOnlyDownloads: boolean;
	setWifiOnlyDownloadsSetting: (setting: boolean) => Promise<void>;
	maxAvailableEditions: number;
	setMaxAvailableEditionsSetting: (setting: number) => Promise<void>;
	isWeatherShown: boolean;
	setIsWeatherShownSetting: (setting: boolean) => Promise<void>;
}

export type IsWeatherShown = {
	isWeatherShown: ConfigState['isWeatherShown'];
	setIsWeatherShown: (setting: boolean) => void;
};

const notificationInitialState = () =>
	Platform.OS === 'android' ? true : false;

const initialState: ConfigState = {
	largeDeviceMemeory: false,
	dimensions: {
		width: 0,
		height: 0,
		scale: 0,
		fontScale: 0,
	},
	notificationsEnabled: notificationInitialState(),
	setNotifications: () => Promise.resolve(),
	wifiOnlyDownloads: false,
	setWifiOnlyDownloadsSetting: () => Promise.resolve(),
	maxAvailableEditions: 7,
	setMaxAvailableEditionsSetting: () => Promise.resolve(),
	isWeatherShown: true,
	setIsWeatherShownSetting: () => Promise.resolve(),
};

const ConfigContext = createContext(initialState);

export const largeDeviceMemory = () => {
	return DeviceInfo.getTotalMemory().then(
		(deviceMemory) => deviceMemory > oneGB,
	);
};

export const notificationsAreEnabled = async () => {
	if (Platform.OS !== 'android') {
		return false;
	}
	const isEnabled = await notificationsEnabledCache.get();
	return isEnabled ?? false;
};

export const getWifiOnlyDownloadsSetting = async (): Promise<
	ConfigState['wifiOnlyDownloads']
> => {
	try {
		const wifiOnlyDownloads = await wifiOnlyDownloadsCache.get();
		return wifiOnlyDownloads ?? initialState.wifiOnlyDownloads;
	} catch {
		return Promise.resolve(false);
	}
};

export const getMaxAvailableEditions = async (): Promise<
	ConfigState['maxAvailableEditions']
> => {
	try {
		const maxAvailableEditions = await maxAvailableEditionsCache.get();
		return maxAvailableEditions ?? initialState.maxAvailableEditions;
	} catch {
		return Promise.resolve(initialState.maxAvailableEditions);
	}
};

export const getIsWeatherShown = async (): Promise<
	ConfigState['isWeatherShown']
> => {
	try {
		const isWeatherShown = await isWeatherShownCache.get();
		return isWeatherShown ?? initialState.isWeatherShown;
	} catch {
		return Promise.resolve(initialState.isWeatherShown);
	}
};

export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
	const [largeDeviceMemeory, setLargeDeviceMemory] = useState(false);
	const [dimensions, setDimensions] = useState(Dimensions.get('window'));
	const [notificationsEnabled, setNotificationsEnabled] = useState(
		notificationInitialState(),
	);
	const [wifiOnlyDownloads, setWifiOnlyDownload] = useState<
		ConfigState['wifiOnlyDownloads']
	>(initialState.wifiOnlyDownloads);
	const [maxAvailableEditions, setMaxAvailableEditions] = useState<
		ConfigState['maxAvailableEditions']
	>(initialState.maxAvailableEditions);
	const [isWeatherShown, setIsWeatherShown] = useState<
		ConfigState['isWeatherShown']
	>(initialState.isWeatherShown);

	const setNotifications = async (setting: boolean) => {
		try {
			await notificationsEnabledCache.set(setting);
			setNotificationsEnabled(setting);
		} catch (e) {
			console.log(e);
			e.message = `Unable to Set Notifications Enabled: ${e.message}`;
			errorService.captureException(e);
		}
	};

	const setWifiOnlyDownloadsSetting = async (setting: boolean) => {
		try {
			await wifiOnlyDownloadsCache.set(setting);
			setWifiOnlyDownload(setting);
		} catch (e) {
			console.log(e);
			e.message = `Unable to Set Wifi Downloads: ${e.message}`;
			errorService.captureException(e);
		}
	};

	const setMaxAvailableEditionsSetting = async (setting: number) => {
		try {
			await maxAvailableEditionsCache.set(setting);
			setMaxAvailableEditions(setting);
		} catch (e) {
			console.log(e);
			e.message = `Unable to Set Max Available Editions: ${e.message}`;
			errorService.captureException(e);
		}
	};

	const setIsWeatherShownSetting = async (setting: boolean) => {
		try {
			await isWeatherShownCache.set(setting);
			setIsWeatherShown(setting);
		} catch (e) {
			console.log(e);
			e.message = `Unable to Set Is Weather Shown: ${e.message}`;
			errorService.captureException(e);
		}
	};

	useEffect(() => {
		notificationsAreEnabled().then((setting) =>
			setNotificationsEnabled(setting),
		);
	}, []);

	useEffect(() => {
		getWifiOnlyDownloadsSetting().then((setting) =>
			setWifiOnlyDownloadsSetting(setting),
		);
	}, []);

	useEffect(() => {
		getMaxAvailableEditions().then((setting) =>
			setMaxAvailableEditionsSetting(setting),
		);
	}, []);

	useEffect(() => {
		getIsWeatherShown().then((setting) =>
			setIsWeatherShownSetting(setting),
		);
	}, []);

	useEffect(() => {
		largeDeviceMemory().then((deviceMemory) =>
			setLargeDeviceMemory(deviceMemory),
		);
	}, []);
	useEffect(() => {
		const listener = (
			ev: Parameters<
				Parameters<typeof Dimensions.addEventListener>[1]
			>[0],
		) => {
			/*
            this fixes this issue:
            https://trello.com/c/iEtMz9TH/867-video-stretched-on-ios-and-android-crash-on-orientation-change

            this means we will never relayout on smaller screens. For now this is ok
            because our screen size assumptions are a 1:1 match with iphone/ipad and
            a good enough™ match on android

            a more elegant fix would be to detect when a full screen video/photo
            is playing, basically anything that enables rotation when
            things below it should not rotate, and not relayout then.
            */
			if (
				Math.min(ev.window.width, ev.window.height) >=
				Breakpoints.TabletVertical
			) {
				setDimensions(ev.window);
			}
		};
		Dimensions.addEventListener('change', listener);
		return () => {
			Dimensions.removeEventListener('change', listener);
		};
	}, []);

	return (
		<ConfigContext.Provider
			value={{
				largeDeviceMemeory,
				dimensions,
				notificationsEnabled,
				setNotifications,
				wifiOnlyDownloads,
				setWifiOnlyDownloadsSetting,
				maxAvailableEditions,
				setMaxAvailableEditionsSetting,
				isWeatherShown,
				setIsWeatherShownSetting,
			}}
		>
			{children}
		</ConfigContext.Provider>
	);
};

export const useLargeDeviceMemory = () =>
	useContext(ConfigContext).largeDeviceMemeory;

export const useDimensions = () => useContext(ConfigContext).dimensions;

export const useNotificationsEnabled = () => ({
	notificationsEnabled: useContext(ConfigContext).notificationsEnabled,
	setNotifications: useContext(ConfigContext).setNotifications,
});

export const useWifiOnlyDownloads = () => ({
	wifiOnlyDownloads: useContext(ConfigContext).wifiOnlyDownloads,
	setWifiOnlyDownloads: useContext(ConfigContext).setWifiOnlyDownloadsSetting,
});

export const useMaxAvailableEditions = () => ({
	maxAvailableEditions: useContext(ConfigContext).maxAvailableEditions,
	setMaxAvailableEditions:
		useContext(ConfigContext).setMaxAvailableEditionsSetting,
});

export const useIsWeatherShown = (): IsWeatherShown => ({
	isWeatherShown: useContext(ConfigContext).isWeatherShown,
	setIsWeatherShown: useContext(ConfigContext).setIsWeatherShownSetting,
});
