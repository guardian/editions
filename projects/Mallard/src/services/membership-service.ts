import { MEMBERS_DATA_API_URL } from 'src/authentication/constants'
import AsyncStorage from '@react-native-community/async-storage'

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
 * A wrapper around AsyncStorage, with json handling and standardizing the interface
 * between AsyncStorage and the keychain helper below
 */
const createAsyncCache = <T extends object>(key: string) => ({
    set: (value: T) => AsyncStorage.setItem(key, JSON.stringify(value)),
    get: (): Promise<T | null> =>
        AsyncStorage.getItem(key).then(value => value && JSON.parse(value)),
    reset: (): Promise<boolean> =>
        AsyncStorage.removeItem(key).then(() => true),
})

const currentMembershipDataCache = createAsyncCache<MembersDataAPIResponse>(
    'current-members-data',
)

const fetchMembershipDataAndCache = async (
    membershipAccessToken: string,
    cache = currentMembershipDataCache,
): Promise<MembersDataAPIResponse> => {
    const res = await fetch(`${MEMBERS_DATA_API_URL}/user-attributes/me`, {
        headers: {
            'GU-IdentityToken': membershipAccessToken,
        },
    })
    const json: MembersDataAPIResponse = await res.json()
    cache.set(json)
    return json
}

export { fetchMembershipDataAndCache, currentMembershipDataCache }
