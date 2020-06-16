import { crashlyticsService } from '../crashlytics'

jest.mock('src/helpers/locale', () => ({
    locale: 'en_GB',
}))

describe('crashlyticsService', () => {
    const crashlytics = crashlyticsService.crashlytics

    it('should send handled exception', () => {
        crashlyticsService.captureException(new Error())
        expect(crashlytics.recordError).toBeCalled()
    })
})
