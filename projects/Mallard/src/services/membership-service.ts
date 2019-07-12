import { MEMBERS_DATA_API_URL } from 'src/authentication/constants'

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
): Promise<MembersDataAPIResponse> => {
    const res = await fetch(`${MEMBERS_DATA_API_URL}/user-attributes/me`, {
        headers: {
            'GU-IdentityToken': membershipAccessToken,
        },
    })
    return res.json()
}

export { fetchMembershipData }
