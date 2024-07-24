import { MEMBERS_DATA_API_URL } from '../../constants';
import type { AuthResult } from '../lib/Result';
import { fromResponse } from '../lib/Result';

export interface MembersDataAPIResponse {
	userId: string;
	showSupportMessaging: boolean;
	contentAccess: {
		member: boolean;
		paidMember: boolean;
		recurringContributor: boolean;
		digitalPack: boolean;
		paperSubscriber: boolean;
		guardianWeeklySubscriber: boolean;
	};
}

const fetchMembershipData = async (
	membershipAccessToken: string,
): Promise<AuthResult<MembersDataAPIResponse>> => {
	const res = await fetch(`${MEMBERS_DATA_API_URL}/user-attributes/me`, {
		headers: {
			'GU-IdentityToken': membershipAccessToken,
		},
	});
	return fromResponse(res);
};

const fetchMembershipDataOkta = async (
	membershipAccessToken: string,
): Promise<AuthResult<MembersDataAPIResponse>> => {
	const headers = {
		Authorization: `Bearer ${membershipAccessToken}`,
	};
	const res = await fetch(`${MEMBERS_DATA_API_URL}/user-attributes/me`, {
		headers,
	});
	return fromResponse(res);
};

export { fetchMembershipData, fetchMembershipDataOkta };
