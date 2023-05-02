import analytics from '@react-native-firebase/analytics';
import type { AnalyticsEvent, AnalyticsUserId } from './types';

const toggleAnalyticsRecording = async (enable: boolean): Promise<boolean> => {
	try {
		await analytics().setAnalyticsCollectionEnabled(enable);
		return true;
	} catch {
		return false;
	}
};

const logScreenView = async (routeName: string): Promise<boolean> => {
	try {
		await analytics().logScreenView({
			screen_name: routeName,
			screen_class: routeName,
		});
		return true;
	} catch {
		return false;
	}
};

const logEvent = async ({ name, value }: AnalyticsEvent): Promise<boolean> => {
	try {
		await analytics().logEvent(name, { value });
		return true;
	} catch {
		return false;
	}
};

// This differs from a screen view as this is a "screen" that has significance to journalism e.g. Article screen view
const logPageView = async (path: string): Promise<boolean> => {
	try {
		await analytics().logEvent('pageView', { path });
		return true;
	} catch {
		return false;
	}
};

const logUserId = async (userId: AnalyticsUserId): Promise<boolean> => {
	try {
		await analytics().setUserId(userId);
		return true;
	} catch {
		return false;
	}
};

export {
	logEvent,
	logPageView,
	logScreenView,
	logUserId,
	toggleAnalyticsRecording,
};
