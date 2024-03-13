import { logEvent, logPageView, logScreenView, logUserId } from '..';
import * as Ophan from 'src/services/ophan';

describe('analytics', () => {
	describe('logEvent', () => {
		it('should call "sendComponentEvent" from the Ophan service', async () => {
			const mockSendComponentEvent = jest
				.spyOn(Ophan, 'sendComponentEvent')
				.mockResolvedValue(true);
			await logEvent({ name: 'testComponent', value: 'testing' });
			expect(mockSendComponentEvent).toHaveBeenCalled();
		});
	});
	describe('logPageView', () => {
		it('should call "sendPageViewEvent" from the Ophan service', async () => {
			const mockSendPageViewEvent = jest
				.spyOn(Ophan, 'sendPageViewEvent')
				.mockResolvedValue(true);
			await logPageView(
				'http://www.theguardian.com/test/path/to/article',
			);
			expect(mockSendPageViewEvent).toHaveBeenCalled();
		});
	});
	describe('logScreenView', () => {
		it('should call "logScreenView" from the Ophan service', async () => {
			const mockAppScreenEvent = jest
				.spyOn(Ophan, 'sendAppScreenEvent')
				.mockResolvedValue(true);
			await logScreenView('IssueScreen');
			expect(mockAppScreenEvent).toHaveBeenCalled();
		});
	});
	describe('logUserId', () => {
		it('should call "setUserId" from the Ophan service', async () => {
			const mockSetUserId = jest
				.spyOn(Ophan, 'setUserId')
				.mockResolvedValue(true);
			await logUserId('12345');
			expect(mockSetUserId).toHaveBeenCalled();
		});
	});
});
