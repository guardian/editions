import type { ErrorServiceImpl } from '../errors';

jest.mock('src/helpers/release-stream', () => ({
	isInBeta: () => false,
}));

jest.mock('src/helpers/storage', () => ({
	userDataCache: {
		get: () => jest.fn().mockResolvedValue(null),
	},
	legacyCASUsernameCache: {
		get: () => jest.fn().mockResolvedValue(null),
	},
	casCredentialsKeychain: {
		get: () => jest.fn().mockResolvedValue(null),
	},
}));

const mockLog = jest.fn();
const mockRecordError = jest.fn();

jest.mock('@react-native-firebase/crashlytics', () =>
	jest.fn().mockImplementation(() => ({
		log: mockLog,
		recordError: mockRecordError,
		setCrashlyticsCollectionEnabled: jest.fn(),
		setAttributes: jest.fn(),
	})),
);

describe('errorService', () => {
	let errorService: ErrorServiceImpl;

	beforeEach(() => {
		jest.resetModules();

		errorService = require('../errors').errorService;
	});

	it('Crashlytics: should default to not having consent', async () => {
		errorService.init({ hasConsent: null });
		await Promise.resolve();

		errorService.captureException(new Error());

		const crashlytics = errorService.crashlytics;
		expect(
			crashlytics.setCrashlyticsCollectionEnabled,
		).toHaveBeenCalledWith(false);

		expect(crashlytics.recordError).not.toHaveBeenCalled();
	});

	it('Crashlytics: should send exception to crashlytics', async () => {
		errorService.init({ hasConsent: true });

		errorService.captureException(new Error());

		expect(errorService.crashlytics.recordError).toBeCalled();
	});
});
