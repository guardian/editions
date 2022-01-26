import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';
import { downloadViaNotification } from 'src/download-edition/download-via-notification';
import { defaultSettings } from 'src/helpers/settings/defaults';
import type { NetInfoState } from 'src/hooks/use-net-info-provider';
import { errorService } from 'src/services/errors';
import { maybeRegister } from './helpers';
import { notificationTracking } from './notification-tracking';
import { pushTracking } from './push-tracking';

export interface PushNotificationRegistration {
	registrationDate: string;
	token: string;
}

const pushNotificationRegistration = (
	downloadBlocked: NetInfoState['downloadBlocked'],
) => {
	PushNotification.configure({
		onRegister: (token: { token: string } | undefined) => {
			pushTracking(
				'notificationToken',
				(token && JSON.stringify(token.token)) || '',
			);
			if (token) {
				maybeRegister(token.token).catch((err) => {
					pushTracking(
						'notificationTokenError',
						JSON.stringify(err) || '',
					);
					console.log(`Error registering for notifications: ${err}`);
					errorService.captureException(err);
				});
			}
		},
		onNotification: async (notification: any) => {
			const key = notification.data.key;
			const notificationId =
				Platform.OS === 'ios'
					? notification.data.uniqueIdentifier
					: notification.uniqueIdentifier;

			await pushTracking('notification', key);
			notificationTracking(notificationId, 'received');

			if (key) {
				try {
					await downloadViaNotification(key, downloadBlocked);
					notificationTracking(notificationId, 'downloaded');
				} catch (e) {
					errorService.captureException(e);
				} finally {
					// required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
					notification.finish(PushNotificationIOS.FetchResult.NoData);
				}
			}
		},
		senderID: defaultSettings.senderId,
		permissions: {
			alert: false,
			badge: false,
			sound: false,
		},
	});

	// Designed to reset the badge number - can be removed over time
	PushNotification.getApplicationIconBadgeNumber(
		(number) =>
			number > 0 && PushNotification.setApplicationIconBadgeNumber(0),
	);
};

export { pushNotificationRegistration };
