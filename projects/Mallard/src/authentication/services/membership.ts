import { MEMBERS_DATA_API_URL } from 'src/constants';
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
	console.log('Members getting called?');
	const headers = {
		Authorization: `Bearer ${membershipAccessToken}`,
	};
	const res = await fetch(`${MEMBERS_DATA_API_URL}/user-attributes/me`, {
		headers,
	});
	// console.log(headers);
	// const json = await res.json();

	// console.log('fetchMembershipData -> response: ', json);
	return fromResponse(res);
};

export { fetchMembershipData };
