import { MEMBERS_DATA_API_URL } from 'src/authentication/constants'

export interface MembersDataAPIResponse {
    userId: string
    showSupportMessaging: true
    contentAccess: {
        member: false
        paidMember: false
        recurringContributor: false
        digitalPack: false
        paperSubscriber: false
        guardianWeeklySubscriber: false
    }
}

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
