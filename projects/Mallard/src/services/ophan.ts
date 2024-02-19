import 'react-native-get-random-values';
import { nanoid } from 'nanoid';
import type { AnalyticsUserId } from 'src/helpers/analytics/types';

enum ComponentType {
	AppButton = 'APP_BUTTON',
	AppVideo = 'APP_VIDEO',
}

enum Action {
	Click = 'CLICK',
	View = 'VIEW',
}

interface TrackScreen {
	screenName: string;
	value?: string;
}

interface TrackComponentEvent {
	componentType: ComponentType;
	action: Action;
	value?: string;
	componentId?: string;
}

const ophan = async (urlParams: string): Promise<boolean> => {
	const viewId = `viewId=${nanoid()}`;
	const url = `https://ophan.theguardian.com/img/1?platfom=editions&${viewId}&${urlParams}`;
	const response = await fetch(url, { method: 'GET' });
	const { status } = response;
	return status === 204;
};

const setUserId = async (userId: AnalyticsUserId) => {
	try {
		if (!userId) return null;
		return await ophan(`userId=${userId}`);
	} catch {
		return null;
	}
};

const sendAppScreenEvent = async ({
	screenName,
	value,
}: TrackScreen): Promise<boolean> => {
	try {
		const componentEvent = {
			component: {
				component: 'APP_SCREEN',
				action: 'VIEW',
				id: screenName,
				value,
			},
		};
		const urlParams = encodeURIComponent(JSON.stringify(componentEvent));
		return await ophan(urlParams);
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
		const componentEvent = {
			component: {
				component: componentType,
				action,
				id: componentId,
				value,
			},
		};
		const urlParams = encodeURIComponent(JSON.stringify(componentEvent));
		return await ophan(urlParams);
	} catch {
		return false;
	}
};

const sendPageViewEvent = async ({ path }: { path: string }) => {
	try {
		const stringPath = encodeURIComponent(path);
		return await ophan(`pageView=${stringPath}`);
	} catch (e) {
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
