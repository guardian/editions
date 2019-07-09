import {
    membershipAccessTokenKeychain,
    userAccessTokenKeychain,
} from './keychain'
import { fetchMembershipData } from 'src/services/membership-service'
import {
    fetchMembershipAccessToken,
    fetchUserAccessTokenWithIdentity,
    fetchUserAccessTokenWithFacebook,
} from 'src/services/id-service'

const fetchAndPersistUserAccessTokenWithIdentity = async (
    email: string,
    password: string,
) => {
    const token = await fetchUserAccessTokenWithIdentity(email, password)
    await userAccessTokenKeychain.set(email, token)
    return token
}

const fetchAndPersistUserAccessTokenWithFacebook = async (fbToken: string) => {
    const token = await fetchUserAccessTokenWithFacebook(fbToken)
    await userAccessTokenKeychain.set('token::facebook', token)
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

export {
    fetchAndPersistUserAccessTokenWithIdentity,
    fetchAndPersistUserAccessTokenWithFacebook,
    getMembershipDataForKeychainUser,
}
