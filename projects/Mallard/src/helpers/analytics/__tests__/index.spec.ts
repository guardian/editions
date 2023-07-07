import { logEvent, logPageView, logScreenView, logUserId } from '..';

const mockLogEvent = jest.fn();
const mockLogScreenView = jest.fn();
const mockSetUserId = jest.fn();
const mockSetUserProperty = jest.fn();

jest.mock('@react-native-firebase/analytics', () =>
	jest.fn().mockImplementation(() => ({
		logEvent: mockLogEvent,
		logScreenView: mockLogScreenView,
		setUserId: mockSetUserId,
		setUserProperty: mockSetUserProperty,
	})),
);

describe('analytics', () => {
	describe('logEvent', () => {
		it('should call "logEvent" from firebase analytics', async () => {
			await logEvent({ name: 'testComponent', value: 'testing' });
			expect(mockLogEvent).toHaveBeenCalled();
		});
	});
	describe('logPageView', () => {
		it('should call "logEvent" from firebase analyticse', async () => {
			await logPageView('test/path/to/article');
			expect(mockLogEvent).toHaveBeenCalled();
		});
	});
	describe('logScreenView', () => {
		it('should call "logScreenView" from firebase analyticse', async () => {
			await logScreenView('IssueScreen');
			expect(mockLogEvent).toHaveBeenCalled();
		});
	});
	describe('logUserId', () => {
		it('should call "setUserId" from firebase analyticse', async () => {
			await logUserId('12345', 'identity');
			expect(mockSetUserId).toHaveBeenCalled();
			expect(mockSetUserProperty).toHaveBeenCalledWith(
				'authType',
				'identity',
			);
		});
	});
});
