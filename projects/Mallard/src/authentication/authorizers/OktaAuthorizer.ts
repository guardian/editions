import {
	getAccessToken,
	getUserFromIdToken,
	isAuthenticated,
} from '@okta/okta-react-native';
import { oktaDataCache } from 'src/helpers/storage';
import { Authorizer } from '../lib/Authorizer';
import type { AuthResult } from '../lib/Result';
import { flat, InvalidResult, ValidResult } from '../lib/Result';
import { fetchMembershipDataOkta } from '../services/membership';
import { oktaAuth } from '../services/okta';
import { canViewEditionOkta } from '../helpers';

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
		console.log('AUTH WITH TOKENS ERROR: ', e);
	}
};

export default new Authorizer({
	name: 'okta',
	userDataCache: oktaDataCache,
	authCaches: [],
	auth: async () => {
		// fetch from the service must return a fromResponse
		// That fromResponse must include a flat with a ValidResult with the data from user and membership

		// okta check gets the user data
		// membership check gets the membership data and double flats them together? With a valid result return

		// Question: What should we persist to check the user has been authenticated again? How do we reauth?

		console.log('GETTING RUN?');
		// eslint-disable-next-line
		const { access_token } = await oktaAuth();
		const data = await authWithTokens(access_token);
		console.log('VALID RESULT?: ', data);
		return data;

		// const casResult = await fetchCASSubscription(subscriberId, password);
		// // This "flat" needs to return a valid result
		// return flat(casResult, async (expiry) => {
		//     // Needs to set a cache with whatever comes back? Not sure as the library caches so do we need to reauth?
		//     // Needs more investigation
		// 	creds.set({
		// 		username: subscriberId,
		// 		token: password,
		// 	});
		// 	return ValidResult(expiry);
		// });
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
