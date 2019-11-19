import { iapReceiptCache } from '../../helpers/storage'
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
    authWithCachedCredentials: fetchActiveIOSSubscriptionReceipt,
    checkUserHasAccess: isReceiptValid,
})
