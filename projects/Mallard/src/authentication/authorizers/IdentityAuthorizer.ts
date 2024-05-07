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

type GoogleCreds = {
	'google-access-token': string;
};

export type AppleCreds = {
	authorizationCode: string;
	idToken: string;
	givenName: string;
	familyName: string;
};

type AppleOauthCreds = {
	'apple-sign-in-token': string;
};

export type AuthParams =
	| BasicCreds
	| GoogleCreds
	| AppleCreds
	| AppleOauthCreds;

type AuthType = 'apple' | 'google' | 'email' | 'apple-oauth' | 'unknown';

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

export const getUserName = (authType: AuthType, params: AuthParams): string => {
	const unknown = 'unknown';
	switch (authType) {
		case 'email':
			if ('email' in params) {
				return params.email;
			}
		case 'google':
			return 'gu-editions::token::google';
		case 'apple':
			return 'gu-editions::token::apple';
		default:
			return unknown;
	}
};

export const detectAuthType = (params: AuthParams): AuthType => {
	if ('email' in params) return 'email';
	if ('google-access-token' in params) return 'google';
	if ('apple-sign-in-token' in params) return 'apple-oauth';
	if ('idToken' in params) return 'apple';
	return 'unknown';
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
