import React, { createContext, useContext, useEffect, useState } from 'react';
import { Dimensions, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { backends, isPreview } from 'src/helpers/settings/defaults';
import {
	apiUrlCache,
	isUsingProdDevtoolsCache,
	maxAvailableEditionsCache,
	notificationsEnabledCache,
	wifiOnlyDownloadsCache,
} from 'src/helpers/storage';
import { errorService } from 'src/services/errors';
import { Breakpoints } from 'src/theme/breakpoints';

const oneGB = 1073741824;

export const API_URL_DEFAULT = backends[0].value;

export interface ConfigState {
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
	isUsingProdDevtools: boolean;
	setIsUsingProdDevToolsSetting: (setting: boolean) => Promise<void>;
	apiUrl: string;
	setApiUrlSetting: (setting: string) => Promise<void>;
}

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
	isUsingProdDevtools: false,
	setIsUsingProdDevToolsSetting: () => Promise.resolve(),
	apiUrl: API_URL_DEFAULT,
	setApiUrlSetting: () => Promise.resolve(),
};

const ConfigContext = createContext(initialState);

export const largeDeviceMemory = () => {
	return DeviceInfo.getTotalMemory().then(
		(deviceMemory) => deviceMemory > oneGB,
	);
};

const notificationsAreEnabled = async () => {
	if (Platform.OS !== 'android') {
		return false;
	}
	const isEnabled = await notificationsEnabledCache.get();
	return isEnabled ?? false;
};

const getWifiOnlyDownloadsSetting = async (): Promise<
	ConfigState['wifiOnlyDownloads']
> => {
	try {
		const wifiOnlyDownloads = await wifiOnlyDownloadsCache.get();
		return wifiOnlyDownloads ?? initialState.wifiOnlyDownloads;
	} catch {
		return Promise.resolve(false);
	}
};

const getIsUsingProdDevToolsSetting = async (): Promise<
	ConfigState['isUsingProdDevtools']
> => {
	try {
		const isUsingProdDevtools = await isUsingProdDevtoolsCache.get();
		return isUsingProdDevtools ?? initialState.isUsingProdDevtools;
	} catch {
		return Promise.resolve(initialState.isUsingProdDevtools);
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

export const getApiUrlSetting = async (): Promise<ConfigState['apiUrl']> => {
	try {
		const apiUrl = await apiUrlCache.get();
		return apiUrl ?? initialState.apiUrl;
	} catch {
		return Promise.resolve(initialState.apiUrl);
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
	const [isUsingProdDevtools, setIsUsingProdDevtools] = useState<
		ConfigState['isUsingProdDevtools']
	>(initialState.isUsingProdDevtools);
	const [apiUrl, setApiUrl] = useState<ConfigState['apiUrl']>(
		initialState.apiUrl,
	);

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

	const setIsUsingProdDevToolsSetting = async (setting: boolean) => {
		try {
			await isUsingProdDevtoolsCache.set(setting);
			setIsUsingProdDevtools(setting);
		} catch (e) {
			console.log(e);
			e.message = `Unable to set "Is Using Prod Dev Tools": ${e.message}`;
			errorService.captureException(e);
		}
	};

	const setApiUrlSetting = async (setting: string) => {
		try {
			await apiUrlCache.set(setting);
			setApiUrl(setting);
		} catch (e) {
			console.log(e);
			e.message = `Unable to set "Is Using Prod Dev Tools": ${e.message}`;
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
		largeDeviceMemory().then((deviceMemory) =>
			setLargeDeviceMemory(deviceMemory),
		);
	}, []);

	useEffect(() => {
		getIsUsingProdDevToolsSetting().then((setting) =>
			setIsUsingProdDevToolsSetting(setting),
		);
	}, []);

	useEffect(() => {
		getApiUrlSetting().then((setting) => setApiUrlSetting(setting));
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
				isUsingProdDevtools,
				setIsUsingProdDevToolsSetting,
				apiUrl,
				setApiUrlSetting,
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

export const useIsUsingProdDevtools = () => ({
	isUsingProdDevtools: useContext(ConfigContext).isUsingProdDevtools,
	setIsUsingProdDevTools:
		useContext(ConfigContext).setIsUsingProdDevToolsSetting,
});

export const useApiUrl = () => ({
	apiUrl: useContext(ConfigContext).apiUrl,
	setApiUrl: useContext(ConfigContext).setApiUrlSetting,
	isProof: useContext(ConfigContext).apiUrl.includes('proof'),
	isPreview: isPreview(useContext(ConfigContext).apiUrl),
});
