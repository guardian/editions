import { casCredentialsKeychain, casDataCache } from 'src/helpers/storage'
import { Authorizer } from '../lib/Authorizer'
import { flat, InvalidResult, ValidResult } from '../lib/Result'
import { fetchCASSubscription } from '../services/cas'

export default new Authorizer(
    'cas',
    casDataCache,
    [casCredentialsKeychain] as const,
    async ([subscriberId, password]: [string, string], [creds]) => {
        const casResult = await fetchCASSubscription(subscriberId, password)
        return flat(casResult, async expiry => {
            creds.set({
                username: subscriberId,
                token: password,
            })
            return ValidResult(expiry)
        })
    },
    async ([credsCache]) => {
        const creds = await credsCache.get()
        return creds
            ? fetchCASSubscription(creds.username, creds.password)
            : InvalidResult()
    },
    expiry => new Date(expiry.expiryDate).getTime() > Date.now(),
)
