const existsMock = jest.fn()
existsMock.mockReturnValueOnce({ then: jest.fn() })

const mkDirMock = jest.fn()
mkDirMock.mockReturnValueOnce({ then: jest.fn(), catch: jest.fn() })

export default {
    DocumentDir: () => {},
    ImageCache: {
        get: {
            clear: () => {},
        },
    },
    fs: {
        mkdir: mkDirMock,
        exists: existsMock,
        dirs: {
            MainBundleDir: () => {},
            CacheDir: () => {},
            DocumentDir: () => {},
        },
        unlink: jest.fn,
    },
}
