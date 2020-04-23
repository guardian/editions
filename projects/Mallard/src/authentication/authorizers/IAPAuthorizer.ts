import { iapReceiptCache, validAttemptDateCache } from '../../helpers/storage'
import { Authorizer } from '../lib/Authorizer'
import {
    fetchActiveIOSSubscriptionReceipt,
    isReceiptValid,
    tryRestoreActiveIOSSubscriptionReceipt,
} from '../services/iap'

export default new Authorizer({
    name: 'iap',
    userDataCache: iapReceiptCache,
    authCaches: [],
    auth: tryRestoreActiveIOSSubscriptionReceipt,
    validAttemptCache: validAttemptDateCache,
    authWithCachedCredentials: fetchActiveIOSSubscriptionReceipt,
    /**
     * If we're offline we can't decode the receipt on the device
     * (not without using OpenSSL). As such we just let them in.
     */
    checkUserHasAccess: (receipt, connectivity) =>
        connectivity === 'offline' ? true : isReceiptValid(receipt),
})
