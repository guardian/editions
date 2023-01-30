import Rate, { AndroidMarket } from 'react-native-rate';

export const rateApp = () => {
	// options are chosen as this is an app driven action rather than user driven
	const options = {
		AppleAppID: '2193813192',
		GooglePackageName: 'com.mywebsite.myapp',
		preferredAndroidMarket: AndroidMarket.Google,
		preferInApp: true,
		openAppStoreIfInAppFails: false,
	};
	Rate.rate(options);
};
