import type { ErrorServiceImpl } from '../errors';

jest.mock('src/helpers/release-stream', () => ({
	isInBeta: () => false,
}));
jest.mock('@sentry/react-native', () => ({
	init: jest.fn(),
	captureException: jest.fn(() => {}),
	setTag: jest.fn(() => {}),
	setExtra: jest.fn(() => {}),
}));

describe('errorService', () => {
	let errorService: ErrorServiceImpl;
	let Sentry: any;

	beforeEach(() => {
		jest.resetModules();

		errorService = require('../errors').errorService;
		Sentry = require('@sentry/react-native');
	});

	it('should not do anything before calling `init`', async () => {
		await Promise.resolve();
		errorService.captureException(new Error());

		expect(Sentry.init).not.toHaveBeenCalled();
		expect(Sentry.captureException).not.toHaveBeenCalled();
	});

	it('should default to not having consent', () => {
		errorService.init({ hasConsent: null });

		errorService.captureException(new Error());

		expect(Sentry.init).not.toHaveBeenCalled();
		expect(Sentry.captureException).not.toHaveBeenCalled();
	});

	it('should install the if consent is set to true', async () => {
		errorService.init({ hasConsent: true });

		expect(Sentry.init).toHaveBeenCalledTimes(1);
	});

	it('should not install without consent', async () => {
		errorService.init({ hasConsent: false });

		expect(Sentry.init).not.toHaveBeenCalled();
	});

	it('should not fire errors without consent', async () => {
		errorService.init({ hasConsent: false });

		errorService.captureException(new Error());
		expect(Sentry.captureException).not.toHaveBeenCalled();
	});

	it('should fire errors with consent', async () => {
		errorService.init({ hasConsent: true });

		errorService.captureException(new Error());
		expect(Sentry.captureException).toHaveBeenCalledTimes(1);
	});

	it('should start firing errors if consent is granted in the app', async () => {
		errorService.init({ hasConsent: false });

		errorService.captureException(new Error());
		expect(Sentry.captureException).not.toHaveBeenCalled();

		errorService.init({ hasConsent: true });

		errorService.captureException(new Error());
		expect(Sentry.captureException).toHaveBeenCalledTimes(1);
	});

	it('should stop firing errors if consent is revoked in the app', async () => {
		errorService.init({ hasConsent: true });

		errorService.captureException(new Error());
		expect(Sentry.captureException).toHaveBeenCalledTimes(1);

		errorService.init({ hasConsent: false });
		errorService.captureException(new Error());
		expect(Sentry.captureException).toHaveBeenCalledTimes(1);
	});

	it('should queue errors that happen while waiting to determine whether we have consent and send them if we do', async () => {
		errorService.init({ hasConsent: null });

		errorService.captureException(new Error());
		errorService.captureException(new Error());

		expect(Sentry.captureException).not.toHaveBeenCalled();

		errorService.init({ hasConsent: true });

		expect(Sentry.captureException).toHaveBeenCalledTimes(2);
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
