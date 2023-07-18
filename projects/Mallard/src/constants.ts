import { Platform } from 'react-native';
import Config from 'react-native-config';

const {
	MEMBERS_DATA_API_URL,
	ITUNES_CONNECT_SHARED_SECRET,
	ANDROID_RELEASE_STREAM,
} = Config;

const CAS_ENDPOINT_URL = 'https://content-auth.guardian.co.uk/subs';

const LEGACY_SUBSCRIBER_ID_USER_DEFAULT_KEY = 'printSubscriberID';
const LEGACY_SUBSCRIBER_POSTCODE_USER_DEFAULT_KEY = 'printSubscriberPostcode';

const JOIN_BETA_LINK = Platform.select({
	ios: 'https://testflight.apple.com/join/O2EojUEl',
	android: 'https://play.google.com/apps/testing/com.guardian.editions',
	default: 'https://testflight.apple.com/join/O2EojUEl',
});

const APPLE_ID = '452707806';
const GOOGLE_PACKAGE_NAME = 'com.guardian.editions';

export {
	CAS_ENDPOINT_URL,
	MEMBERS_DATA_API_URL,
	LEGACY_SUBSCRIBER_ID_USER_DEFAULT_KEY,
	LEGACY_SUBSCRIBER_POSTCODE_USER_DEFAULT_KEY,
	ITUNES_CONNECT_SHARED_SECRET,
	ANDROID_RELEASE_STREAM,
	JOIN_BETA_LINK,
	APPLE_ID,
	GOOGLE_PACKAGE_NAME,
};
