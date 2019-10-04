import DeviceInfo from 'react-native-device-info'
import { AuthResult, fromResponse } from '../lib/Result'
import { CAS_ENDPOINT_URL } from 'src/constants'

export interface CASExpiry {
    content: string
    expiryDate: string
    expiryType: string
    provider: string
    subscriptionCode: string
}

const fetchCASSubscription = async (
    subscriberID: string,
    password: string,
): Promise<AuthResult<CASExpiry>> => {
    const appId = await DeviceInfo.getBundleId()
    const deviceId = await DeviceInfo.getUniqueId()

    const res = await fetch(CAS_ENDPOINT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            appId,
            deviceId,
            subscriberId: subscriberID,
            password: password,
        }),
    })

    return fromResponse(res, {
        valid: data => data.expiry,
    })
}

export { fetchCASSubscription }
