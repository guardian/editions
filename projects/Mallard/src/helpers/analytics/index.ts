import analytics from '@react-native-firebase/analytics';
import {
	Action,
	ComponentType,
	sendComponentEvent,
	sendPageViewEvent,
	setUserId,
} from 'src/services/ophan';
import type { AnalyticsEvent, AnalyticsUserId } from './types';

const toggleAnalyticsRecording = async (enable: boolean): Promise<boolean> => {
	try {
		await analytics().setAnalyticsCollectionEnabled(enable);
		return true;
	} catch {
		return false;
	}
};

// Currently not used in Ophan as this refers to user behaviour rather than journalism
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
		await sendComponentEvent({
			componentType: ComponentType.AppButton,
			action: Action.Click,
			value,
			componentId: name,
		});
		await analytics().logEvent(name, { value });
		return true;
	} catch {
		return false;
	}
};

// This differs from a screen view as this is a "screen" that has significance to journalism e.g. Article screen view
const logPageView = async (path: string): Promise<boolean> => {
	try {
		await sendPageViewEvent({ path });
		await analytics().logEvent('pageView', { path });
		return true;
	} catch {
		return false;
	}
};

const logUserId = async (userId: AnalyticsUserId): Promise<boolean> => {
	try {
		await setUserId(userId);
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
