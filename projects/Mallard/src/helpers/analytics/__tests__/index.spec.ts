import * as ophan from 'src/services/ophan';
import { logEvent, logPageView, logScreenView, logUserId } from '..';

const mockLogEvent = jest.fn();
const mockLogScreenView = jest.fn();
const mockSetUserId = jest.fn();

jest.mock('@react-native-firebase/analytics', () =>
	jest.fn().mockImplementation(() => ({
		logEvent: mockLogEvent,
		logScreenView: mockLogScreenView,
		setUserId: mockSetUserId,
	})),
);

describe('analytics', () => {
	describe('logEvent', () => {
		it('should call "sendComponentEvent" from ophan service', async () => {
			const mockComponentEvent = jest
				.spyOn(ophan, 'sendComponentEvent')
				.mockResolvedValue(true);
			await logEvent({ name: 'testComponent', value: 'testing' });
			expect(mockComponentEvent).toHaveBeenCalled();
			expect(mockLogEvent).toHaveBeenCalled();
		});
	});
	describe('logPageView', () => {
		it('should call "sendPageViewEvent" from ophan service', async () => {
			const mockPageViewEvent = jest
				.spyOn(ophan, 'sendPageViewEvent')
				.mockResolvedValue(true);
			await logPageView('test/path/to/article');
			expect(mockPageViewEvent).toHaveBeenCalled();
			expect(mockLogEvent).toHaveBeenCalled();
		});
	});
	describe('logScreenView', () => {
		it('should call "sendPageViewEvent" from ophan service', async () => {
			await logScreenView('IssueScreen');
			expect(mockLogEvent).toHaveBeenCalled();
		});
	});
	describe('logUserId', () => {
		it('should call "setUserId" from ophan service', async () => {
			const mockSetUserId = jest
				.spyOn(ophan, 'setUserId')
				.mockResolvedValue('12345');
			await logUserId('12345');
			expect(mockSetUserId).toHaveBeenCalled();
			expect(mockSetUserId).toHaveBeenCalled();
		});
	});
});
