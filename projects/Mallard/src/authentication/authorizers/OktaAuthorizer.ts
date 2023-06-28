import {
	getAccessToken,
	getUserFromIdToken,
	isAuthenticated,
} from '@okta/okta-react-native';
import { oktaDataCache } from 'src/helpers/storage';
import { canViewEditionOkta } from '../helpers';
import { Authorizer } from '../lib/Authorizer';
import type { AuthResult } from '../lib/Result';
import { flat, InvalidResult, ValidResult } from '../lib/Result';
import { fetchMembershipDataOkta } from '../services/membership';
import { oktaAuth } from '../services/okta';

const authWithTokens = async (mtoken: string): Promise<AuthResult<any>> => {
	try {
		const [userDetails, membershipDataResult] = await Promise.all([
			getUserFromIdToken(),
			fetchMembershipDataOkta(mtoken),
		]);
		return flat(membershipDataResult, async (membershipDetails) =>
			ValidResult({
				userDetails,
				membershipDetails,
			}),
		);
	} catch (e) {
		return InvalidResult();
	}
};

export default new Authorizer({
	name: 'okta',
	userDataCache: oktaDataCache,
	authCaches: [],
	auth: async () => {
		// eslint-disable-next-line
		const authResponse = await oktaAuth();
		if (!authResponse) {
			return InvalidResult();
		}
		const data = await authWithTokens(authResponse.access_token);
		return data;
	},
	authWithCachedCredentials: async () => {
		const isLoggedIn = await isAuthenticated();
		if (!isLoggedIn) {
			return InvalidResult();
		}

		// eslint-disable-next-line
		const { access_token } = await getAccessToken();
		if (!access_token) return InvalidResult();
		return authWithTokens(access_token);
	},
	checkUserHasAccess: canViewEditionOkta,
});
