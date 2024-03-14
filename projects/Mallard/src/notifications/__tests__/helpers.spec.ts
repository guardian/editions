import MockDate from 'mockdate';
import { subDays } from 'src/helpers/date';
import { shouldReRegister } from '../helpers';
import type { PushToken } from '../notification-service';

MockDate.set('2019-08-21');
const today = new Date();

describe('push-notifications/helpers', () => {
	describe('shouldReRegister', () => {
		it('should return false if time is not exceeded, or the tokens are the same or topics match', () => {
			const registrationCache = {
				token: 'token',
				registrationDate: today.toISOString(),
			};
			const topics = [{ name: 'uk', type: 'editions' }] as PushToken[];
			expect(
				shouldReRegister(
					'token',
					registrationCache,
					today,
					topics,
					topics,
				),
			).toBe(false);
		});
		it('should return true if the 14 day period is exceeded but the rest remains the same', () => {
			const registrationCache = {
				token: 'token',
				registrationDate: subDays(today, 15).toISOString(),
			};
			const topics = [{ name: 'uk', type: 'editions' }] as PushToken[];
			expect(
				shouldReRegister(
					'token',
					registrationCache,
					today,
					topics,
					topics,
				),
			).toBe(true);
		});
		it('should return true if a different token is provided', () => {
			const registrationCache = {
				token: 'token',
				registrationDate: today.toISOString(),
			};
			const topics = [{ name: 'uk', type: 'editions' }] as PushToken[];
			expect(
				shouldReRegister(
					'different-token',
					registrationCache,
					today,
					topics,
					topics,
				),
			).toBe(true);
		});
		it('should return true of the topics do not match', () => {
			const registrationCache = {
				token: 'token',
				registrationDate: subDays(today, 15).toISOString(),
			};
			const topics = [{ name: 'uk', type: 'editions' }] as PushToken[];
			const differentTopics = [
				{ name: 'au', type: 'editions' },
			] as PushToken[];
			expect(
				shouldReRegister(
					'token',
					registrationCache,
					today,
					topics,
					differentTopics,
				),
			).toBe(true);
		});
		it('should return false if the topics are but in different order', () => {
			const registrationCache = {
				token: 'token',
				registrationDate: today.toISOString(),
			};
			const topics = [{ name: 'uk', type: 'editions' }] as PushToken[];
			const topics2 = [{ type: 'editions', name: 'uk' }] as PushToken[];
			expect(
				shouldReRegister(
					'token',
					registrationCache,
					today,
					topics,
					topics2,
				),
			).toBe(false);
		});
	});
});
