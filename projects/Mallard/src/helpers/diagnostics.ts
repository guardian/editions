import { Clipboard, Linking, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import RNFS from 'react-native-fs';
import { canViewEdition, getCASCode } from 'src/authentication/helpers';
import type { AnyAttempt } from 'src/authentication/lib/Attempt';
import { isValid } from 'src/authentication/lib/Attempt';
import { getSelectedEditionSlug } from 'src/hooks/use-edition-provider';
import type { GdprCoreSettings } from 'src/hooks/use-gdpr';
import type {
	NetInfoCalculated,
	NetInfoCore,
} from 'src/hooks/use-net-info-provider/types';
import { FSPaths } from 'src/paths';
import type { OnCompletionToast } from 'src/screens/settings/help-screen';
import { getDiagnosticPushTracking } from '../notifications/push-tracking';
import { runActionSheet } from './action-sheet';
import { getFileList } from './files';
import { locale } from './locale';
import { isInBeta } from './release-stream';
import { imageForScreenSize } from './screen';
import {
	iapReceiptCache,
	pushRegisteredTokens,
	userDataCache,
} from './storage';
import {
	ANDROID_BETA_EMAIL,
	DIAGNOSTICS_REQUEST,
	IOS_BETA_EMAIL,
	USER_EMAIL_BODY_INTRO,
} from './words';

type NetInfoDiagnostic = NetInfoCore & NetInfoCalculated;

const getDiagnosticInfo = async (
	authAttempt: AnyAttempt<string>,
	netInfo: NetInfoDiagnostic,
	gdprSettings: GdprCoreSettings,
) => {
	const [casCode, idData, receiptData] = await Promise.all([
		getCASCode(),
		userDataCache.get(),
		iapReceiptCache.get(),
	]);

	const folderStat = await RNFS.stat(FSPaths.issuesDir);
	const size = parseInt(folderStat.size);
	const bytes = size;
	const kilobytes = bytes / 1000;
	const megabytes = kilobytes / 1000;
	const gigabytes = megabytes / 1000;
	const buildNumber = DeviceInfo.getBuildNumber();
	const version = DeviceInfo.getVersion();
	const deviceId = DeviceInfo.getDeviceId();
	const uniqueId = DeviceInfo.getUniqueId();

	const bytesToMb = (bytes: number) =>
		Math.floor(bytes / 1024 / 1024).toLocaleString('en');

	const [
		firstInstallTime,
		lastUpdateTime,
		totalDiskCapacity,
		freeDiskStorage,
		fileList,
		imageSize,
		pushTracking,
		edition,
		registeredPushTokens,
	] = await Promise.all([
		DeviceInfo.getFirstInstallTime(),
		DeviceInfo.getLastUpdateTime(),
		DeviceInfo.getTotalDiskCapacity(),
		DeviceInfo.getFreeDiskStorage(),
		getFileList(),
		imageForScreenSize(),
		getDiagnosticPushTracking(),
		getSelectedEditionSlug(),
		pushRegisteredTokens.get(),
	]);

	return `

The information below will help us to better understand your query:

-App-
Product: Guardian Editions
App Version: ${version} ${buildNumber}
Release Channel: ${isInBeta() ? 'BETA' : 'RELEASE'}
Current Edition: ${edition}
Locale: ${locale}
First app start: ${firstInstallTime}
Last updated: ${lastUpdateTime}
Image Size for Downloads: ${imageSize}

-Device-
${Platform.OS} Version: ${Platform.Version}
Device Type: ${deviceId}
Device Id: ${uniqueId}
Network: Type: ${netInfo.type}
Network: Connected?: ${netInfo.isConnected}
Network: Internet Reachable?: ${netInfo.isInternetReachable}
Network: Poor Connection?: ${netInfo.isPoorConnection}
Privacy settings: ${Object.keys(gdprSettings)
		.map((key) => `${key}: ${gdprSettings[key as keyof GdprCoreSettings]}`)
		.join(' ')}
Editions Data Folder Size: ${bytes}B / ${kilobytes}KB / ${megabytes}MB / ${gigabytes}GB
Total Disk Space (Mb): ${bytesToMb(totalDiskCapacity)}
Available Disk Space (Mb): ${bytesToMb(freeDiskStorage)}
Issues on device: ${fileList && JSON.stringify(fileList, null, 2)}

-User / Supporter Info-
Signed In: ${isValid(authAttempt)}
Digital Pack subscription: ${idData && canViewEdition(idData)}
Apple IAP Transaction Details: ${
		receiptData && `\n${JSON.stringify(receiptData, null, 2)}`
	}
Subscriber ID: ${casCode}

-Registered Push Tokens-
${JSON.stringify(registeredPushTokens)}

-Push Downloads-
${pushTracking && JSON.stringify(pushTracking, null, 2)}
`;
};

const openSupportMailto = async (
	text: string,
	releaseURL: string,
	body?: string,
) => {
	const email = Platform.select({
		ios: isInBeta() ? IOS_BETA_EMAIL : releaseURL,
		android: isInBeta() ? ANDROID_BETA_EMAIL : releaseURL,
	});

	const version = DeviceInfo.getVersion();
	const buildNumber = DeviceInfo.getBuildNumber();

	const subject = `${text} - ${Platform.OS} Editions ${
		isInBeta() ? 'Beta' : ''
	} App, ${version} ${buildNumber}`;

	return Linking.openURL(
		`mailto:${email}?subject=${encodeURIComponent(subject)}${
			body ? `&body=${encodeURIComponent(body)}` : ''
		}`,
	);
};

const createMailtoHandler =
	(
		text: string,
		releaseURL: string,
		authAttempt: AnyAttempt<string>,
		netInfo: NetInfoDiagnostic,
		gdprSettings: GdprCoreSettings,
		dialogTitle = '',
	) =>
	() =>
		runActionSheet(dialogTitle, DIAGNOSTICS_REQUEST, [
			{
				text: 'Include',
				onPress: async () => {
					const diagnostics = await getDiagnosticInfo(
						authAttempt,
						netInfo,
						gdprSettings,
					);
					openSupportMailto(
						text,
						releaseURL,
						` ${USER_EMAIL_BODY_INTRO} \n \n${diagnostics}`,
					);
				},
			},
			{
				text: `Don't include`,
				onPress: () =>
					openSupportMailto(
						text,
						releaseURL,
						`${USER_EMAIL_BODY_INTRO}`,
					),
			},
		]);

const copyDiagnosticInfoToClipboard =
	(
		authAttempt: AnyAttempt<string>,
		netInfo: NetInfoDiagnostic,
		gdprSettings: GdprCoreSettings,
		callback: OnCompletionToast,
	) =>
	async () => {
		const diagnostics = await getDiagnosticInfo(
			authAttempt,
			netInfo,
			gdprSettings,
		);
		Clipboard.setString(diagnostics);
		callback('Diagnostic info copied to clipboard');
	};

const createSupportMailto = (
	text: string,
	releaseURL: string,
	authAttempt: AnyAttempt<string>,
	netInfo: NetInfoDiagnostic,
	gdprSettings: GdprCoreSettings,
	dialogTitle = '',
) => ({
	key: text,
	title: text,
	linkWeight: 'regular' as const,
	onPress: createMailtoHandler(
		text,
		releaseURL,
		authAttempt,
		netInfo,
		gdprSettings,
		dialogTitle,
	),
});

const copyDiagnosticInfo = (
	text: string,
	authAttempt: AnyAttempt<string>,
	netInfo: NetInfoDiagnostic,
	gdprSettings: GdprCoreSettings,
	callback: OnCompletionToast,
) => ({
	key: text,
	title: text,
	linkWeight: 'regular' as const,
	onPress: copyDiagnosticInfoToClipboard(
		authAttempt,
		netInfo,
		gdprSettings,
		callback,
	),
});

export { createSupportMailto, createMailtoHandler, copyDiagnosticInfo };
