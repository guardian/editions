import * as Keychain from 'react-native-keychain'
import { ID_AUTH_URL, MEMBERS_DATA_API_URL } from './constants'

const createServiceTokenStore = (service: string) => ({
    get: () => Keychain.getGenericPassword({ service }),
    set: (username: string, token: string) =>
        Keychain.setGenericPassword(username, token, { service }),
    reset: () => Keychain.resetGenericPassword({ service }),
})

const userAccessTokenKeychain = createServiceTokenStore(ID_AUTH_URL)
const membershipAccessTokenKeychain = createServiceTokenStore(
    MEMBERS_DATA_API_URL,
)

const resetCredentials = () =>
    Promise.all([
        userAccessTokenKeychain.reset(),
        membershipAccessTokenKeychain.reset(),
    ])

export {
    userAccessTokenKeychain,
    membershipAccessTokenKeychain,
    resetCredentials,
}
