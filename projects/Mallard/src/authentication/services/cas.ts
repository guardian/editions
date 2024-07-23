import DeviceInfo from 'react-native-device-info';
import type { CASExpiry } from '../../common';
import { CAS_ENDPOINT_URL } from '../../constants';
import type { AuthResult } from '../lib/Result';
import { fromResponse } from '../lib/Result';

const fetchCASSubscription = async (
	subscriberID: string,
	password: string,
): Promise<AuthResult<CASExpiry>> => {
	const appId = DeviceInfo.getBundleId();
	const deviceId = DeviceInfo.getUniqueId();

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
	});

	return fromResponse(res, {
		valid: (data) => data.expiry,
	});
};

export { fetchCASSubscription };
