import {
	createConfig,
	EventEmitter,
	getUserFromIdToken,
	introspectRefreshToken,
	signInWithBrowser,
	signOut,
} from '@okta/okta-react-native';
import { Platform } from 'react-native';
import { fromResponse } from '../lib/Result';

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
	})
		.then(() => {
			console.log('OKTA CORRECT');
		})
		.catch(() => {
			console.log('OKTA ERROR');
		});

	EventEmitter.addListener('onError', function (e: Event) {
		console.log(e);
	});
};

const oktaAuth = async () => {
	try {
		const attempt = await signInWithBrowser();
		// const user = await getUserFromIdToken();
		// console.log('okta user: ', user);
		console.log('okta attempt:', attempt);
		return attempt;
	} catch (e) {
		console.log('OKTA ERROR: ');
		console.log(e);
	}
};

const oktaAuthFromResponse = async () => {
	try {
		const attempt = await signInWithBrowser();
		const user = await getUserFromIdToken();
		console.log('okta user: ', user);
		return fromResponse(user, {
			valid: () => user,
		});
	} catch (e) {
		console.log('OKTA ERROR: ');
		console.log(e);
	}
};

const oktaSignOut = async () => {
	try {
		const attempt = await signOut();
		return attempt;
	} catch (e) {
		console.log(e);
	}
};

export { oktaInitialisation, oktaAuth, oktaAuthFromResponse, oktaSignOut };
