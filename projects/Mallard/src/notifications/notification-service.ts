import { Platform } from 'react-native';
import { isInBeta } from '../helpers/release-stream';
import {
	defaultSettings,
	notificationEdition,
} from '../helpers/settings/defaults';
import { getDefaultEdition } from '../hooks/use-edition-provider';
import { errorService } from '../services/errors';

export interface PushToken {
	name: 'uk' | 'us' | 'au';
	type: 'editions';
}

const registerWithNotificationService = async (
	token: string,
	topics: PushToken[],
) => {
	const registerDeviceUrl = defaultSettings.notificationServiceRegister;
	const options = {
		deviceToken: token,
		platform:
			Platform.OS === 'ios'
				? notificationEdition.ios
				: notificationEdition.android,
		topics,
	};

	if (isInBeta()) {
		const defaultEdition = await getDefaultEdition();
		console.log('*** NOTIFICATION REG PAYLOAD *** ');
		console.log(`*** default edition *** ${defaultEdition}`);
		console.log('*** body *** ' + JSON.stringify(options));
	}

	return fetch(registerDeviceUrl, {
		method: 'post',
		body: JSON.stringify(options),
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) =>
			response.ok
				? Promise.resolve(response.json())
				: Promise.reject(response.status),
		)
		.catch((e) => {
			errorService.captureException(e);
		});
};

export { registerWithNotificationService };
