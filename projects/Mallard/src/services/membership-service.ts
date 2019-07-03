import { MEMBERS_DATA_API_URL } from 'src/authentication/constants'

const fetchMembershipData = async (membershipAccessToken: string) => {
    const res = await fetch(`${MEMBERS_DATA_API_URL}/user-attributes/me`, {
        headers: {
            'GU-IdentityToken': membershipAccessToken,
        },
    })
    return res.json()
}

export { fetchMembershipData }
