import {
    membershipAccessTokenKeychain,
    userAccessTokenKeychain,
} from './keychain'
import { fetchMembershipData } from 'src/services/membership-service'
import {
    fetchMembershipAccessToken,
    fetchUserAccessToken,
} from 'src/services/id-service'

const fetchAndPersistUserAccessToken = async (
    email: string,
    password: string,
) => {
    const token = await fetchUserAccessToken(email, password)
    await userAccessTokenKeychain.set(email, token)
    return token
}

const getMembershipDataForKeychainUser = async () => {
    const membershipToken = await membershipAccessTokenKeychain.get()
    if (membershipToken) return fetchMembershipData(membershipToken.password)

    // no cached membership token, try and get the userToken so we can generate a new membership token
    const userToken = await userAccessTokenKeychain.get()
    if (!userToken) {
        // no userToken - we need to be logged in again
        return null
    }
    const newMembershipToken = await fetchMembershipAccessToken(
        userToken.password,
    )
    // cache the new token
    membershipAccessTokenKeychain.set(userToken.username, newMembershipToken)
    return fetchMembershipData(newMembershipToken)
}

export { fetchAndPersistUserAccessToken, getMembershipDataForKeychainUser }
