import {
	createConfig,
	signInWithBrowser,
	signOut,
} from '@okta/okta-react-native';
import { Platform } from 'react-native';
import { errorService } from 'src/services/errors';

const oktaInitialisation = () => {
	createConfig({
		clientId: '0oa7e94uh4CY1DgFf417',
		issuer: 'https://profile.theguardian.com/oauth2/aus3xgj525jYQRowl417',
		discoveryUri:
			'https://profile.theguardian.com/oauth2/aus3xgj525jYQRowl417',
		redirectUri:
			Platform.OS === 'ios'
				? 'uk.co.guardian.gce.oauth:/authorization/callback'
				: 'com.guardian.editions.oauth:/authorization/callback',
		endSessionRedirectUri:
			Platform.OS === 'ios'
				? 'uk.co.guardian.gce.oauth:/logout/callback'
				: 'com.guardian.editions.oauth:/logout/callback',
		scopes: [
			'openid',
			'guardian.members-data-api.read.self',
			'profile',
			'offline_access',
		],
		requireHardwareBackedKeyStore: true,
	});
};

const oktaAuth = async () => {
	try {
		const attempt = await signInWithBrowser();
		return attempt;
	} catch (e) {
		errorService.captureException(e);
	}
};

const oktaSignOut = async () => {
	try {
		const attempt = await signOut();
		return attempt;
	} catch (e) {
		errorService.captureException(e);
	}
};

export { oktaInitialisation, oktaAuth, oktaSignOut };
