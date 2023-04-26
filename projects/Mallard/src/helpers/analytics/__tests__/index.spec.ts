import * as ophan from 'src/services/ophan';
import { logEvent, logPageView, logUserId } from '..';

describe('analytics', () => {
	describe('logEvent', () => {
		it('should call "sendComponentEvent" from ophan service', () => {
			const mockComponentEvent = jest
				.spyOn(ophan, 'sendComponentEvent')
				.mockResolvedValue(true);
			logEvent({ value: 'testing' });
			expect(mockComponentEvent).toHaveBeenCalled();
		});
	});
	describe('logPageView', () => {
		it('should call "sendPageViewEvent" from ophan service', () => {
			const mockPageViewEvent = jest
				.spyOn(ophan, 'sendPageViewEvent')
				.mockResolvedValue(true);
			logPageView('test/path/to/article');
			expect(mockPageViewEvent).toHaveBeenCalled();
		});
	});
	describe('logUserId', () => {
		it('should call "setUserId" from ophan service', () => {
			const mockSetUserId = jest
				.spyOn(ophan, 'setUserId')
				.mockResolvedValue('12345');
			logUserId('12345');
			expect(mockSetUserId).toHaveBeenCalled();
		});
	});
});
