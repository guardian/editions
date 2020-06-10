jest.mock('src/helpers/locale', () => ({
    locale: () => jest.fn().mockReturnValue('en_GB'),
}))
