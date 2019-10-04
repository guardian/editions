import {
    casCredentialsKeychain,
    casDataCache,
    legacyCASUsernameCache,
    legacyCASPasswordCache,
} from 'src/helpers/storage'
import { Authorizer } from '../lib/Authorizer'
import { flat, ValidResult, ErrorResult } from '../lib/Result'
import { fetchCASSubscription } from '../services/cas'

export default new Authorizer(
    'cas',
    casDataCache,
    [
        casCredentialsKeychain,
        legacyCASUsernameCache,
        legacyCASPasswordCache,
    ] as const,
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
    async ([credsCache, luser, lpass]) => {
        const creds = await credsCache.get()

        if (creds) return fetchCASSubscription(creds.username, creds.password)

        const [username, password] = await Promise.all([
            luser.get(),
            lpass.get(),
        ])
        if (username && password) {
            return fetchCASSubscription(username, password)
        }
        return ErrorResult()
    },
    expiry => new Date(expiry.expiryDate).getTime() > Date.now(),
)
