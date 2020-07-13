jest.mock('src/helpers/locale', () => ({
    locale: 'en_US',
}))

jest.mock('src/push-notifications/push-notifications', () => ({
    pushNotifcationRegistration: () => jest.fn(),
}))
