import DeviceInfo from 'react-native-device-info'
import { AuthResult, fromResponse } from '../lib/Result'
import { CAS_ENDPOINT_URL } from 'src/constants'
import { CASExpiry } from '../../../../Apps/common/src/cas-expiry'

const fetchCASSubscription = async (
    subscriberID: string,
    password: string,
): Promise<AuthResult<CASExpiry>> => {
    const appId = DeviceInfo.getBundleId()
    const deviceId = DeviceInfo.getUniqueId()

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
