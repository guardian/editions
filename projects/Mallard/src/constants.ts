import { Platform } from 'react-native';
import Config from 'react-native-config';

const {
	ID_API_URL,
	MEMBERS_DATA_API_URL,
	ID_ACCESS_TOKEN,
	ITUNES_CONNECT_SHARED_SECRET,
	ANDROID_RELEASE_STREAM,
} = Config;

const AUTH_TTL = 86400000; // ms in a day

const CAS_ENDPOINT_URL = 'https://content-auth.guardian.co.uk/subs';

const GOOGLE_CLIENT_ID =
	Platform.OS === 'android'
		? __DEV__
			? '774465807556-5oq58e8pnfqn9sptsivri5kcs9mthef9'
			: '774465807556-cjat38acttpl7md4nfc4pfediouh7v97'
		: '774465807556-kgaj5an4pc4fmr3svp5nfpulekc1rl3n';

const LEGACY_SUBSCRIBER_ID_USER_DEFAULT_KEY = 'printSubscriberID';
const LEGACY_SUBSCRIBER_POSTCODE_USER_DEFAULT_KEY = 'printSubscriberPostcode';

const JOIN_BETA_LINK = Platform.select({
	ios: 'https://testflight.apple.com/join/O2EojUEl',
	android: 'https://play.google.com/apps/testing/com.guardian.editions',
	default: 'https://testflight.apple.com/join/O2EojUEl',
});

const APPLE_ID = 452707806;
const GOOGLE_PACKAGE_NAME = 'com.guardian.editions';

export {
	CAS_ENDPOINT_URL,
	ID_API_URL,
	MEMBERS_DATA_API_URL,
	ID_ACCESS_TOKEN,
	GOOGLE_CLIENT_ID,
	AUTH_TTL,
	LEGACY_SUBSCRIBER_ID_USER_DEFAULT_KEY,
	LEGACY_SUBSCRIBER_POSTCODE_USER_DEFAULT_KEY,
	ITUNES_CONNECT_SHARED_SECRET,
	ANDROID_RELEASE_STREAM,
	JOIN_BETA_LINK,
	APPLE_ID,
	GOOGLE_PACKAGE_NAME,
};
