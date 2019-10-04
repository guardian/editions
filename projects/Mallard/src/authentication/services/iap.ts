import RNIAP, { Purchase } from 'react-native-iap'
import { Platform } from 'react-native'
import { ITUNES_CONNECT_SHARED_SECRET, USE_SANDBOX_IAP } from 'src/constants'
import { ReceiptValidationResponse } from 'react-native-iap/apple'
import { NativeModules } from 'react-native'
import { InvalidResult, AuthResult, ValidResult } from '../lib/Result'
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
const tryRestoreActiveIOSSubscriptionReceipt = async (): Promise<
    AuthResult<ReceiptIOS>
> => {
    try {
        if (Platform.OS !== 'ios') return InvalidResult()
        const purchases = await RNIAP.getAvailablePurchases()
        const mostRecentReceipt = getMostRecentTransactionReceipt(purchases)
        if (!mostRecentReceipt) return InvalidResult()
        const decodedReceipt = await fetchDecodeReceipt(mostRecentReceipt)
        if (!decodedReceipt) return InvalidResult()
        const validReceipt = findValidReceipt(decodedReceipt)
        return validReceipt ? ValidResult(validReceipt) : InvalidResult()
    } catch {
        return InvalidResult()
    }
}

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
const fetchActiveIOSSubscriptionReceipt = async (): Promise<
    AuthResult<ReceiptIOS>
> => {
    if (Platform.OS !== 'ios') return InvalidResult()
    let receipt: string | undefined
    try {
        receipt = await getReceiptData()
    } catch (e) {
        return InvalidResult()
    }
    const decodedReceipt = await fetchDecodeReceipt(receipt)
    if (!decodedReceipt) return InvalidResult()
    const validReceipt = findValidReceipt(decodedReceipt)
    return validReceipt ? ValidResult(validReceipt) : InvalidResult()
}

export {
    fetchActiveIOSSubscriptionReceipt,
    tryRestoreActiveIOSSubscriptionReceipt,
    isReceiptActive,
}
