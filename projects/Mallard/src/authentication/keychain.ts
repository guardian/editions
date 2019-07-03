import * as Keychain from 'react-native-keychain'
import { ID_AUTH_URL, MEMBERS_DATA_API_URL } from './constants'

const IGNORE_KEYCHAIN = false

interface ServiceTokenStore {
    get: () => ReturnType<typeof Keychain.getGenericPassword>
    set: (
        username: string,
        token: string,
    ) => ReturnType<typeof Keychain.setGenericPassword>
    reset: () => ReturnType<typeof Keychain.resetGenericPassword>
}

const createServiceTokenStore = (service: string): ServiceTokenStore => ({
    get: () =>
        IGNORE_KEYCHAIN
            ? Promise.resolve(false as const)
            : Keychain.getGenericPassword({
                  service,
              }),
    set: (username: string, token: string) =>
        Keychain.setGenericPassword(username, token, {
            service,
        }),
    reset: () => Keychain.resetGenericPassword({ service }),
})

const userAccessTokenKeychain = createServiceTokenStore(ID_AUTH_URL)
const membershipAccessTokenKeychain = createServiceTokenStore(
    MEMBERS_DATA_API_URL,
)

export { userAccessTokenKeychain, membershipAccessTokenKeychain }
