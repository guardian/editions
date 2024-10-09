import {
	legacyUserAccessTokenKeychain,
	membershipAccessTokenKeychain,
	userAccessTokenKeychain,
	userDataCache,
} from '../../helpers/storage';
import { canViewEdition } from '../helpers';
import { Authorizer } from '../lib/Authorizer';
import { InvalidResult } from '../lib/Result';
import type { MembersDataAPIResponse } from '../services/membership';

type BasicCreds = {
	email: string;
	password: string;
};

export type AuthParams = BasicCreds;

interface User {
	id: string;
	dates: {
		accountCreatedDate: string;
	};
	adData: {};
	consents: Array<{
		id: string;
		actor: string;
		version: number;
		consented: boolean;
		timestamp: string;
		privacyPolicyVersion: number;
	}>;
	userGroups: Array<{
		path: string;
		packageCode: string;
	}>;
	socialLinks: Array<{
		network: string;
		socialId: string;
	}>;
	publicFields: {
		displayName: string;
	};
	statusFields: {
		hasRepermissioned: boolean;
		userEmailValidated: boolean;
		allowThirdPartyProfiling: boolean;
	};
	primaryEmailAddress: string;
	hasPassword: boolean;
}

export type IdentityAuthData = {
	userDetails: User;
	membershipData: MembersDataAPIResponse;
};

export default new Authorizer({
	name: 'identity',
	userDataCache,
	authCaches: [
		userAccessTokenKeychain,
		membershipAccessTokenKeychain,
		legacyUserAccessTokenKeychain,
	] as const,
	auth: async () => {
		return InvalidResult();
	},
	authWithCachedCredentials: async () => {
		return InvalidResult();
	},
	checkUserHasAccess: canViewEdition,
});
