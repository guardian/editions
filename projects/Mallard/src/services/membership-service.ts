import { MEMBERS_DATA_API_URL } from 'src/constants'

export interface MembersDataAPIResponse {
    userId: string
    showSupportMessaging: boolean
    contentAccess: {
        member: boolean
        paidMember: boolean
        recurringContributor: boolean
        digitalPack: boolean
        paperSubscriber: boolean
        guardianWeeklySubscriber: boolean
    }
}

/**
 * DO NOT USE THIS DIRECTLY
 *
 * In most cases you will want to use the method that caches the result of this request
 * in order that re-authentication can use the cached credentials
 */
const fetchMembershipData = async (
    membershipAccessToken: string,
): Promise<MembersDataAPIResponse> => {
    const res = await fetch(`${MEMBERS_DATA_API_URL}/user-attributes/me`, {
        headers: {
            'GU-IdentityToken': membershipAccessToken,
        },
    })
    return res.json()
}

export { fetchMembershipData }
