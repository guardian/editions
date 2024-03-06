import MockDate from 'mockdate';
import { receiptIOS } from 'src/authentication/__tests__/fixtures';
import { addDays, subDays } from 'src/helpers/date';
import { findValidReceipt, isReceiptValid } from '../iap';

MockDate.set('2019-08-21');
const today = new Date();

describe('iap', () => {
	describe('isReceiptValid', () => {
		it('returns false for expiry dates that are more thanthree days older than now', () => {
			const fourDaysAgo = subDays(today, 4);
			const isValid = isReceiptValid(
				receiptIOS({ expires_date: fourDaysAgo }),
			);

			expect(isValid).toBe(false);
		});

		it('returns true for expiry dates that are less than three days older than now', () => {
			const twoDaysAgo = subDays(today, 2);
			const isValid = isReceiptValid(
				receiptIOS({ expires_date: twoDaysAgo }),
			);

			expect(isValid).toBe(true);
		});
	});
	describe('findValidReceipt', () => {
		it('should return a valid iap receipt if its found', () => {
			const twoDaysInFuture = addDays(today, 2);
			const receipt = receiptIOS({ expires_date: twoDaysInFuture });
			const receiptValidationResponse = {
				status: 0,
				receipt: {
					bundle_id: 'test',
					application_version: '1.2',
					in_app: [],
					original_application_version: '',
					receipt_creation_date: '',
				},
				latest_receipt_info: [receipt],
			};
			expect(findValidReceipt(receiptValidationResponse)).toEqual(
				receipt,
			);
		});
		it('should return null if latest_receipt_info param is empty', () => {
			const receiptValidationResponse = {
				status: 0,
				receipt: {
					bundle_id: 'test',
					application_version: '1.2',
					in_app: [],
					original_application_version: '',
					receipt_creation_date: '',
				},
				latest_receipt_info: [],
			};
			expect(findValidReceipt(receiptValidationResponse)).toEqual(null);
		});
		it('should return null if it cant find a valid receipt', () => {
			const fourDaysAgo = subDays(today, 4);
			const receipt = receiptIOS({ expires_date: fourDaysAgo });
			const receiptValidationResponse = {
				status: 0,
				receipt: {
					bundle_id: 'test',
					application_version: '1.2',
					in_app: [],
					original_application_version: '',
					receipt_creation_date: '',
				},
				latest_receipt_info: [receipt],
			};
			expect(findValidReceipt(receiptValidationResponse)).toEqual(null);
		});
		it('should return null if last_receipt_info is missing', () => {
			const receiptValidationResponse = {
				status: 0,
				receipt: {
					bundle_id: 'test',
					application_version: '1.2',
					in_app: [],
					original_application_version: '',
					receipt_creation_date: '',
				},
			};
			expect(findValidReceipt(receiptValidationResponse)).toEqual(null);
		});
	});
});
