import { CrashlyticsService } from '../crashlytics'

jest.mock('@react-native-firebase/crashlytics', () => ({
    setCrashlyticsCollectionEnabled: jest.fn(() => {}),
    recordError: jest.fn((err: Error) => {}),
}))

describe('crashlyticsService', () => {
    let crashlytics = require('@react-native-firebase/crashlytics')
    let crashlyticsService: CrashlyticsService

    it('should send handled exception', () => {
        crashlyticsService = require('../crashlytics').crashlyticsService
        crashlyticsService.captureException(new Error())
        expect(crashlytics.recordError).toBeCalled()
    })
})
