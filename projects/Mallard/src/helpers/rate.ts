import { Linking, Platform } from 'react-native';
import Rate, { AndroidMarket } from 'react-native-rate';
import { APPLE_ID, GOOGLE_PACKAGE_NAME } from 'src/constants';

export const rateApp = () => {
	// options are chosen as this is an app driven action rather than user driven
	const options = {
		AppleAppID: APPLE_ID,
		GooglePackageName: GOOGLE_PACKAGE_NAME,
		preferredAndroidMarket: AndroidMarket.Google,
		preferInApp: true,
		openAppStoreIfInAppFails: false,
	};
	Rate.rate(options, (success) => {
		if (!success) {
			Platform.select({
				ios: Linking.openURL(
					`itms-apps://itunes.apple.com/app/id${APPLE_ID}`,
				),
				android: Linking.openURL(
					`market://details?id=${GOOGLE_PACKAGE_NAME}`,
				),
			});
		}
	});
};
