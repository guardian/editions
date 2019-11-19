import moment from 'moment'
import { receiptIOS } from 'src/authentication/__tests__/fixtures'
import { isReceiptValid } from '../iap'

describe('iap', () => {
    describe('isReceiptValid', () => {
        it('returns false for expiry dates that are more thanthree days older than now', () => {
            const fourDaysAgo = moment()
                .subtract(4, 'days')
                .toDate()
            const isValid = isReceiptValid(
                receiptIOS({ expires_date: fourDaysAgo }),
            )

            expect(isValid).toBe(false)
        })

        it('returns true for expiry dates that are less than three days older than now', () => {
            const twoDaysAgo = moment()
                .subtract(2, 'days')
                .toDate()
            const isValid = isReceiptValid(
                receiptIOS({ expires_date: twoDaysAgo }),
            )

            expect(isValid).toBe(true)
        })
    })
})
