import { AuthResult, fromResponse } from '../lib/Result'
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

const fetchMembershipData = async (
    membershipAccessToken: string,
): Promise<AuthResult<MembersDataAPIResponse>> => {
    const res = await fetch(`${MEMBERS_DATA_API_URL}/user-attributes/me`, {
        headers: {
            'GU-IdentityToken': membershipAccessToken,
        },
    })
    return fromResponse(res)
}

export { fetchMembershipData }
