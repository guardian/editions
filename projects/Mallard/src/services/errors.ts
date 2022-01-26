import type { FirebaseCrashlyticsTypes } from '@react-native-firebase/crashlytics';
import crashlytics from '@react-native-firebase/crashlytics';
import * as Sentry from '@sentry/react-native';
import Config from 'react-native-config';
import { getCASCode } from 'src/authentication/helpers';
import { isInBeta } from 'src/helpers/release-stream';
import { userDataCache } from 'src/helpers/storage';
import type { GdprSwitchSetting } from 'src/hooks/use-gdpr';

const { SENTRY_DSN_URL } = Config;

interface ErrorService {
	init({ hasConsent }: { hasConsent: GdprSwitchSetting }): void;
	captureException(err: Error): void;
}

export class ErrorServiceImpl implements ErrorService {
	// Can be `null` or boolean. This is kinda confusing and easy to
	// handle improperly, but not easy to change it's already in prod.
	private hasConsent: GdprSwitchSetting;
	private hasSentryConfigured: boolean;
	private pendingQueue: Error[];

	crashlytics: FirebaseCrashlyticsTypes.Module;

	constructor() {
		this.hasConsent = null;
		this.hasSentryConfigured = false;
		this.pendingQueue = [];
		this.crashlytics = crashlytics();
	}

	public init({ hasConsent }: { hasConsent: GdprSwitchSetting }) {
		this.hasConsent = hasConsent;
		this.initSentry(hasConsent);
		this.initCrashlytics(hasConsent);
	}

	initSentry(hasConsent: GdprSwitchSetting) {
		if (!hasConsent) {
			console.log('Sentry initialized ignore, no user permission');
			return;
		}

		if (!this.hasSentryConfigured) {
			// sampleRate helps keep our sentry costs down
			Sentry.init({ dsn: SENTRY_DSN_URL, sampleRate: 0.2 });

			Sentry.setTag(
				'environment',
				__DEV__ ? 'DEV' : isInBeta() ? 'BETA' : 'RELEASE',
			);
			Sentry.setExtra('react', true);
			this.hasSentryConfigured = true;
			console.log('Sentry initialized');
		}

		while (this.pendingQueue.length > 0) {
			const err = this.pendingQueue.pop();
			if (err) {
				Sentry.captureException(err);
				this.crashlytics.recordError(err);
			}
		}
	}

	private async initCrashlytics(
		hasConsent: GdprSwitchSetting,
	): Promise<void> {
		console.log(
			'Crashlytics current status:',
			this.crashlytics.isCrashlyticsCollectionEnabled,
		);

		console.log('Setting crashlytics with user permission:', hasConsent);
		await this.crashlytics.setCrashlyticsCollectionEnabled(
			hasConsent ?? false,
		);

		if (hasConsent) {
			this.crashlytics.log('Crashlytics initialized');
			await this.sendBasicAttributes();
			console.log('Crashlytics now initialized');
		} else {
			console.log('Crashlytics is now Disabled');
		}
	}

	private sendBasicAttributes = async () => {
		const [userData, casCode] = await Promise.all([
			userDataCache.get(),
			getCASCode(),
		]);

		const digitalSub =
			userData?.membershipData?.contentAccess?.digitalPack ?? false;

		const signedIn = userData ? true : false;

		this.crashlytics.setAttributes({
			signedIn: String(signedIn),
			hasCasCode: String(casCode !== null || casCode !== ''),
			hasDigiSub: String(digitalSub),
		});
	};

	/**
	 * If there is explicitly no consent, discard errors. If we don't know yet
	 * (`null`), store in a queue that will get logged when we get consent.
	 */
	public captureException(err: Error) {
		if (this.hasConsent === null) {
			this.pendingQueue.push(err);
		} else if (this.hasConsent) {
			Sentry.captureException(err);
			this.crashlytics.recordError(err);
		}
	}
}

export const errorService: ErrorService = new ErrorServiceImpl();
