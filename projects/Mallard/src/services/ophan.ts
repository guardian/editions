// Based on: https://github.com/guardian/ophan/blob/master/event-model/src/main/thrift/componentevent.thrift

import { NativeModules } from 'react-native';
import type {
	AnalyticsScreenTracking,
	AnalyticsUserId,
} from 'src/helpers/analytics/types';

enum ComponentType {
	AppButton = 'APP_BUTTON',
	AppVideo = 'APP_VIDEO',
}

enum Action {
	Click = 'CLICK',
	View = 'VIEW',
}

interface TrackScreen {
	screenName: AnalyticsScreenTracking;
	value?: string;
}

interface TrackComponentEvent {
	componentType: ComponentType;
	action: Action;
	value?: string;
	componentId?: string;
}

const setUserId = async (userId: AnalyticsUserId): Promise<AnalyticsUserId> => {
	try {
		return await NativeModules.Ophan.setUserId(userId);
	} catch {
		return null;
	}
};

const sendAppScreenEvent = async ({
	screenName,
	value,
}: TrackScreen): Promise<boolean> => {
	try {
		await NativeModules.Ophan.sendAppScreenEvent(screenName, value);
		return true;
	} catch {
		return false;
	}
};

const sendComponentEvent = async ({
	componentType,
	action,
	value,
	componentId,
}: TrackComponentEvent): Promise<boolean> => {
	try {
		await NativeModules.Ophan.sendComponentEvent(
			componentType,
			action,
			value,
			componentId,
		);
		return true;
	} catch {
		return false;
	}
};

const sendPageViewEvent = async ({ path }: { path: string }) => {
	try {
		await NativeModules.Ophan.sendPageViewEvent(path);
		return true;
	} catch {
		return false;
	}
};

export {
	Action,
	ComponentType,
	sendAppScreenEvent,
	sendComponentEvent,
	sendPageViewEvent,
	setUserId,
};
