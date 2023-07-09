import type { ErrorServiceImpl } from '../errors';

jest.mock('src/helpers/release-stream', () => ({
	isInBeta: () => false,
}));

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
