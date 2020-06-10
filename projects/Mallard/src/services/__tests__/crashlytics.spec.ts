import { CrashlyticsService } from '../crashlytics'

jest.mock('@react-native-firebase/crashlytics', () => ({
    setCrashlyticsCollectionEnabled: jest.fn(() => {}),
    recordError: jest.fn((err: Error) => {}),
}))

describe('crashlyticsService', () => {
    const crashlytics = require('@react-native-firebase/crashlytics')
    let crashlyticsService: CrashlyticsService

    beforeEach(() => {
        crashlyticsService = require('../crashlytics').crashlyticsService
    })

    it('should send handled exception', () => {
        crashlyticsService.captureException(new Error())
        expect(crashlytics.recordError).toBeCalled()
    })
})
