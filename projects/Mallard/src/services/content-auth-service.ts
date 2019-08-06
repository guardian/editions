import DeviceInfo from 'react-native-device-info'
import { CAS_ENDPOINT_URL } from '../constants'

export interface CasExpiry {
    content: string
    expiryDate: string
    expiryType: string
    provider: string
    subscriptionCode: string
}

interface CasError {
    message: string
    code: number
}

/**
 * DO NOT USE THIS DIRECTLY
 *
 * In most cases you will want to use the method that caches the result of this request
 * in order that re-authentication can use the cached credentials
 */
const fetchCasSubscription = async (
    subscriberID: string,
    password: string,
): Promise<CasExpiry> => {
    const res = await fetch(CAS_ENDPOINT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            appId: DeviceInfo.getBundleId(),
            deviceId: DeviceInfo.getUniqueID(),
            subscriberId: subscriberID,
            password: password,
        }),
    })

    const json = await res.json()

    if (res.status !== 200) {
        const casError: CasError = json
        throw new Error(`${casError.message}`)
    }

    return json.expiry
}

export { fetchCasSubscription }
