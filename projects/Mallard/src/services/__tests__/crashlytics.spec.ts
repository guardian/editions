import { crashlyticsService } from '../crashlytics'

describe('crashlyticsService', () => {
    const crashlytics = crashlyticsService.crashlytics

    it('should send handled exception', () => {
        crashlyticsService.captureException(new Error())
        expect(crashlytics.recordError).toBeCalled()
    })
})
