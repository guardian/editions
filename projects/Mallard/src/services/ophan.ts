import 'react-native-get-random-values';
import { customAlphabet } from 'nanoid';
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
	const viewIdString = customAlphabet('qwertyuiopasdfghjklzxcvbnm0123456789');
	const viewId = `viewId=${viewIdString(17).toLowerCase()}`;
	const url = `https://ophan.theguardian.com/img/1?v=17&platfom=editions&${viewId}&${urlParams}`;
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

const sendPageViewEvent = async ({ url }: { url: string }) => {
	try {
		const stringPath = encodeURIComponent(url);
		return await ophan(
			`url=${stringPath}&ref=https%3A%2F%2Fwww.theguardian.com%2Fuk&visibilityState=visible&tz=0&navigationType=reload`,
		);
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
