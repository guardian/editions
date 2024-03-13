import {
	Action,
	ComponentType,
	sendAppScreenEvent,
	sendComponentEvent,
	sendPageViewEvent,
	setUserId,
} from 'src/services/ophan';
import type { AnalyticsEvent, AnalyticsUserId } from './types';

const logScreenView = async (
	routeName: string,
	value?: string,
): Promise<boolean> => {
	try {
		await sendAppScreenEvent({ screenName: routeName, value });
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
		return true;
	} catch {
		return false;
	}
};

// This differs from a screen view as this is a "screen" that has significance to journalism e.g. Article screen view
const logPageView = async (url: string): Promise<boolean> => {
	try {
		await sendPageViewEvent({ url });
		return true;
	} catch {
		return false;
	}
};

const logUserId = async (userId: AnalyticsUserId): Promise<boolean> => {
	try {
		await setUserId(userId);
		return true;
	} catch {
		return false;
	}
};

export { logEvent, logPageView, logScreenView, logUserId };
