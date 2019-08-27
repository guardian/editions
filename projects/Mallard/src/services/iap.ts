import RNIAP, { Purchase } from 'react-native-iap'
import { Platform } from 'react-native'
import { ITUNES_CONNECT_SHARED_SECRET, USE_SANDBOX_IAP } from 'src/constants'
import { ReceiptValidationResponse } from 'react-native-iap/apple'
import { authTypeFromIAP } from 'src/authentication/credentials-chain'
import { NativeModules } from 'react-native'
const { InAppUtils } = NativeModules

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
        USE_SANDBOX_IAP,
    )

const getMostRecentTransactionReceipt = (purchases: Purchase[]) => {
    if (!purchases.length) return false
    return purchases.sort((a, b) => b.transactionDate - a.transactionDate)[0]
        .transactionReceipt
}

const isReceiptActive = (receipt: ReceiptIOS) => {
    const expirationInMilliseconds = Number(receipt.expires_date_ms)
    const nowInMilliseconds = Date.now()
    return expirationInMilliseconds > nowInMilliseconds
}

const findValidReceipt = (receipt: ReceiptValidationResponse) =>
    (receipt.latest_receipt_info as ReceiptIOS[]).find(isReceiptActive) || null

/**
 * This will attempt to restore existing purchases
 */
const restoreActiveIOSSubscriptionReceipt = async (): Promise<ReceiptIOS | null> => {
    if (Platform.OS !== 'ios') return null
    const purchases = await RNIAP.getAvailablePurchases()
    const mostRecentReceipt = getMostRecentTransactionReceipt(purchases)
    if (!mostRecentReceipt) return null
    const decodedReceipt = await fetchDecodeReceipt(mostRecentReceipt)
    if (!decodedReceipt) return null
    return findValidReceipt(decodedReceipt)
}

const tryToRestoreActiveIOSSubscriptionToAuth = () =>
    restoreActiveIOSSubscriptionReceipt()
        .then(authTypeFromIAP)
        .catch(() => false as const)

const getReceiptData = (): Promise<string> =>
    new Promise((res, rej) =>
        InAppUtils.receiptData((error: boolean, receiptData: string) => {
            if (error) {
                rej('Receipt not found')
            } else {
                res(receiptData)
            }
        }),
    )

// This will attempt to look for the existing receipt without trying to restore those purchases
const fetchActiveIOSSubscriptionReceipt = async (): Promise<ReceiptIOS | null> => {
    if (Platform.OS !== 'ios') return null
    let receipt: string | undefined
    try {
        receipt = await getReceiptData()
    } catch (e) {
        return null
    }
    const decodedReceipt = await fetchDecodeReceipt(receipt)
    if (!decodedReceipt) return null
    return findValidReceipt(decodedReceipt)
}

export {
    fetchActiveIOSSubscriptionReceipt,
    tryToRestoreActiveIOSSubscriptionToAuth,
    isReceiptActive,
}
