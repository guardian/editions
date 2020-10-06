jest.mock('src/helpers/locale', () => ({
    locale: 'en_AU',
}))

jest.mock('src/notifications/push-notifications', () => ({
    pushNotificationRegistration: () => jest.fn(),
}))

jest.mock('@react-native-community/geolocation', () => ({
    setRNConfiguration: () => {},
    getCurrentPosition: resolve =>
        Promise.resolve().then(() => {
            resolve({
                coords: { latitude: 12, longitude: 34 },
            })
        }),
}))

jest.mock('react-native-permissions', () => {
    return {
        RESULTS: { GRANTED: 1, DENIED: 2 },
        PERMISSIONS: {
            IOS: { LOCATION_WHEN_IN_USE: 1 },
            ANDROID: { ACCESS_FINE_LOCATION: 1 },
        },
        check: jest.fn().mockResolvedValue(2),
    }
})

jest.mock('react-native-localize', () => ({
    getLocales: () => [
        {
            countryCode: 'GB',
            languageTag: 'en-GB',
            languageCode: 'en',
            isRTL: false,
        },
        {
            countryCode: 'US',
            languageTag: 'en-US',
            languageCode: 'en',
            isRTL: false,
        },
    ],
}))
