import RNIAP, { Purchase } from 'react-native-iap'
import { Platform } from 'react-native'
import { ITUNES_CONNECT_SHARED_SECRET } from 'src/constants'

export interface ReceiptIOS {
    expires_date: string
    expires_date_ms: string
    expires_date_pst: string
    is_in_intro_offer_period: string
    is_trial_period: string
    original_purchase_date: string
    original_purchase_date_ms: string
    original_purchase_date_pst: string
    original_transaction_id: string
    product_id: string
    purchase_date: string
    purchase_date_ms: string
    purchase_date_pst: string
    quantity: string
    transaction_id: string
    web_order_line_item_id: string
}

const fetchDecodeReceipt = (receipt: string) =>
    RNIAP.validateReceiptIos(
        {
            'receipt-data': receipt,
            password: ITUNES_CONNECT_SHARED_SECRET,
        },
        __DEV__,
    )

const getMostRecentTransactionReceipt = (purchases: Purchase[]) => {
    if (!purchases.length) return false
    return purchases.sort((a, b) => b.transactionDate - a.transactionDate)[0]
        .transactionReceipt
}

const receiptIsCurrentlyActive = (receipt: ReceiptIOS) => {
    const expirationInMilliseconds = Number(receipt.expires_date_ms)
    const nowInMilliseconds = Date.now()
    return expirationInMilliseconds > nowInMilliseconds
}

// The essence of this came from here: https://github.com/dooboolab/react-native-iap/issues/275#issuecomment-433582389
const fetchActiveIOSSubscriptionReceipt = async (): Promise<ReceiptIOS | null> => {
    if (Platform.OS !== 'ios') return null
    const purchases = await RNIAP.getAvailablePurchases()
    const mostRecentReceipt = getMostRecentTransactionReceipt(purchases)
    if (!mostRecentReceipt) return null
    const decodedReceipt = await fetchDecodeReceipt(mostRecentReceipt)
    if (!decodedReceipt) return null
    return (
        (decodedReceipt.latest_receipt_info as ReceiptIOS[]).find(
            receiptIsCurrentlyActive,
        ) || null
    )
}

export { fetchActiveIOSSubscriptionReceipt }
