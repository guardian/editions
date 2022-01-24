import { Platform } from 'react-native';
import type { ConfigState } from 'src/hooks/use-config-provider';

interface Settings {
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

/*
Default settings.
This is a bit of a mess
*/
export const backends = [
	{
		title: 'PROD published',
		value: 'https://editions.guardianapis.com/',
		preview: false,
	},
	{
		title: 'PROD proofed',
		value: 'https://editions-proof.guardianapis.com/',
		preview: true,
	},
	{
		title: 'PROD preview',
		value: 'https://editions-preview.guardianapis.com/',
		preview: true,
	},
	{
		title: 'CODE published',
		value: 'https://editions.code.dev-guardianapis.com/',
		preview: false,
	},
	{
		title: 'CODE proofed',
		value: 'https://editions-proof.code.dev-guardianapis.com/',
		preview: true,
	},
	{
		title: 'CODE preview',
		value: 'https://editions-preview.code.dev-guardianapis.com/',
		preview: true,
	},
	{
		title: 'DEV',
		value: 'http://localhost:3131/',
		preview: true,
	},
] as Array<{
	title: string;
	value: string;
	preview: boolean;
}>;

const notificationServiceRegister = {
	prod: 'https://notifications.guardianapis.com/device/register',
	code: 'https://notifications.code.dev-guardianapis.com/device/register',
};

export const notificationEdition = {
	ios: 'ios-edition',
	android: 'android-edition',
};

const notificationTrackingReceivedEndpoints = {
	prod: 'https://mobile-events.guardianapis.com/notification/received',
	code: 'https://mobile-events.code.dev-guardianapis.com/notification/received',
};

const notificationTrackingDownloadedEndpoints = {
	prod: 'https://mobile-events.guardianapis.com/notification/downloaded',
	code: 'https://mobile-events.code.dev-guardianapis.com/notification/downloaded',
};

const senderId = {
	prod: '493559488652',
	code: '385815722272',
};

export const notificationTrackingUrl = (
	notificationId: string,
	type: 'received' | 'downloaded',
) => {
	const edition =
		Platform.OS === 'ios'
			? notificationEdition.ios
			: notificationEdition.android;

	const params = `?notificationId=${notificationId}&platform=${edition}`;

	const urlType =
		type === 'received'
			? notificationTrackingReceivedEndpoints
			: notificationTrackingDownloadedEndpoints;

	const url = __DEV__ ? urlType.code : urlType.prod;

	return `${url}${params}`;
};

const apiUrl = backends[0].value;

const storeDetails = {
	ios: 'itms-apps://itunes.apple.com/app/id452707806',
	android: 'market://details?id=com.guardian.editions',
};

// @TODO Move API values to sit with the API url in the config provider
export const defaultSettings: Settings = {
	notificationServiceRegister: __DEV__
		? notificationServiceRegister.code
		: notificationServiceRegister.prod,
	cacheClearUrl: apiUrl + 'cache-clear',
	deprecationWarningUrl: apiUrl + 'deprecation-warning',
	editionsUrl: apiUrl + 'editions',
	issuesPath: '/issues',
	storeDetails,
	senderId: __DEV__ ? senderId.code : senderId.prod,
	websiteUrl: 'https://www.theguardian.com/',
	logging: __DEV__
		? 'https://editions-logging.code.dev-guardianapis.com/log/mallard'
		: 'https://editions-logging.guardianapis.com/log/mallard',
};

export const editionsEndpoint = (apiUrl: ConfigState['apiUrl']): string =>
	`${apiUrl}editions`;

export const htmlEndpoint = (
	apiUrl: ConfigState['apiUrl'],
	publishedIssueId: string,
): string => `${apiUrl}${publishedIssueId}/html`;

export const isPreview = (apiUrl: ConfigState['apiUrl']): boolean => {
	const backend = backends.find((backend) => backend.value === apiUrl);
	return backend?.preview ?? false;
};
