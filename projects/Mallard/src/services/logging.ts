// Logging Service that sends event logs to ELK
import { Platform } from 'react-native';
import Config from 'react-native-config';
import DeviceInfo from 'react-native-device-info';
import { getCASCode } from 'src/authentication/helpers';
import { isInBeta } from 'src/helpers/release-stream';
import { defaultSettings } from 'src/helpers/settings/defaults';
import {
	iapReceiptCache,
	loggingQueueCache,
	userDataCache,
} from 'src/helpers/storage';
import {
	getDefaultEditionSlug,
	getSelectedEditionSlug,
} from 'src/hooks/use-edition-provider';
import type { GdprSwitchSetting } from 'src/hooks/use-gdpr';
import type { NetInfoState } from 'src/hooks/use-net-info-provider';
import type { MallardLogFormat } from '../../../Apps/common/src/logging';
import {
	Feature,
	Level,
	OS,
	ReleaseChannel,
} from '../../../Apps/common/src/logging';
import { AsyncQueue } from '../helpers/async-queue-cache';
import { NetInfoStateType } from '../hooks/use-net-info-provider';
import { errorService } from './errors';
import { remoteConfigService } from './remote-config';

const { LOGGING_API_KEY } = Config;
const ATTEMPTS_THEN_CLEAR = 10;
const MAX_NUM_OF_LOGS = 30;

interface LogParams {
	level: Level;
	message: string;
	optionalFields?: object;
}

const cropMessage = (message: string, maxLength: number): string => {
	return message.length > maxLength
		? `${message.slice(0, 6)}... (message cropped)`
		: message;
};

class Logging extends AsyncQueue {
	isConnected: boolean;
	isPoorConnection: boolean;
	networkStatus: NetInfoStateType;
	hasConsent: GdprSwitchSetting;
	numberOfAttempts: number;
	enabled: boolean;

	constructor() {
		super(loggingQueueCache);
		this.hasConsent = false;
		this.isConnected = true;
		this.isPoorConnection = false;
		this.networkStatus = NetInfoStateType.unknown;
		this.numberOfAttempts = 0;
		this.enabled = remoteConfigService.getBoolean('logging_enabled');
	}

	init({
		hasConsent,
		isConnected,
		isPoorConnection,
		networkStatus,
	}: {
		hasConsent: GdprSwitchSetting;
		isConnected: NetInfoState['isConnected'];
		isPoorConnection: NetInfoState['isPoorConnection'];
		networkStatus: NetInfoState['type'];
	}) {
		this.hasConsent = hasConsent;
		this.isConnected = isConnected;
		this.isPoorConnection = isPoorConnection;
		this.networkStatus = networkStatus;
	}

	async getExternalInfo() {
		const [userData, casCode, iapReceipt] = await Promise.all([
			userDataCache.get(),
			getCASCode(),
			iapReceiptCache.get(),
		]);
		return {
			userData,
			casCode,
			iapReceipt,
		};
	}

	async baseLog({
		level,
		message,
		...optionalFields
	}: LogParams): Promise<MallardLogFormat> {
		const { userData, casCode, iapReceipt } = await this.getExternalInfo();

		// User Data and Subscription
		const userId = userData?.userDetails?.id ?? '';
		const digitalSub =
			userData?.membershipData?.contentAccess?.digitalPack ?? false;
		const iAP = iapReceipt ? true : false;
		const selectedEdition = await getSelectedEditionSlug();
		const defaultEdition = await getDefaultEditionSlug();

		return {
			app: DeviceInfo.getBundleId(),
			version: DeviceInfo.getVersion(),
			buildNumber: DeviceInfo.getBuildNumber(),
			os: Platform.OS === 'ios' ? OS.IOS : OS.ANDROID,
			device: DeviceInfo.getDeviceId(),
			isConnected: this.isConnected,
			isPoorConnection: this.isPoorConnection,
			networkStatus: this.networkStatus,
			selectedEdition: selectedEdition,
			defaultEdition: defaultEdition,
			release_channel: isInBeta()
				? ReleaseChannel.BETA
				: ReleaseChannel.RELEASE,
			timestamp: new Date(),
			level,
			message,
			deviceId: DeviceInfo.getUniqueId(),
			signedIn: userData ? true : false,
			userId,
			digitalSub,
			casCode,
			iAP,
			...optionalFields,
		};
	}

	async postLogToService(log: object[]): Promise<Response | Error> {
		const response = await fetch(defaultSettings.logging, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'x-api-key': LOGGING_API_KEY,
			},
			body: JSON.stringify(log),
		});
		if (response.status !== 200) {
			throw new Error(
				`Bad response from Logging Service - status: ${response.status}`,
			);
		}
		return response;
	}

	async postLogs() {
		try {
			// Only attempt if we are connected, otherwise wait till next time
			if (this.isConnected) {
				const logsToPost = await this.getQueuedItems();

				if (logsToPost.length > 1) {
					await this.postLogToService(logsToPost);
					await this.clearItems();
					this.numberOfAttempts = 0;
				}
			}
		} catch (e) {
			if (this.numberOfAttempts >= ATTEMPTS_THEN_CLEAR) {
				await this.clearItems();
				this.numberOfAttempts = 0;
			} else {
				this.numberOfAttempts++;
			}
			errorService.captureException(e);
			return e;
		}
	}

	async log({ level, message, ...optionalFields }: LogParams) {
		try {
			if (!this.hasConsent) {
				return;
			}

			// limit max length of message we post to logging service
			const croppedMessage = cropMessage(message, 300);

			const currentLog = await this.baseLog({
				level,
				message: croppedMessage,
				...optionalFields,
			});

			return this.upsertQueuedItems([currentLog], MAX_NUM_OF_LOGS);
		} catch (e) {
			errorService.captureException(e);
			return e;
		}
	}

	async basicLogInfo({
		level,
		message,
		...optionalFields
	}: LogParams): Promise<MallardLogFormat> {
		return await this.baseLog({ level, message, ...optionalFields });
	}
}

const loggingService = new Logging();

export { Level, Feature, Logging, loggingService, cropMessage };
