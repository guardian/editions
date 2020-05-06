import {
    Level,
    baseLog,
    log,
    privateFunctions as mockWrapper,
} from '../logging'
import MockDate from 'mockdate'

jest.mock('@react-native-community/netinfo', () => ({
    fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
    NetInfoStateType: {
        unknown: 'unknown',
    },
}))
MockDate.set('2019-08-21')

describe('logging service', () => {
    describe('baseLog', () => {
        it('should return a log object that matches the snapshot', async () => {
            mockWrapper.getExternalInfo = jest.fn().mockReturnValue({
                networkStatus: { type: 'wifi' },
                userData: {
                    userDetails: { id: 'testId' },
                    membershipData: {
                        contentAccess: { digitalPack: true },
                    },
                },
                casCode: 'QWERTYUIOP',
                iapReceipt: true,
            })
            const log = await baseLog({
                level: Level.INFO,
                message: 'test log',
                optionalFields: { id: 'test' },
            })
            expect(log).toMatchSnapshot()
        })
        it('should return an object with default values if they are missing and match snapshot', async () => {
            mockWrapper.getExternalInfo = jest.fn().mockReturnValue({
                networkStatus: null,
                userData: null,
                casCode: null,
                iapReceipt: null,
            })
            const log = await baseLog({
                level: Level.INFO,
                message: 'test log',
                optionalFields: { id: 'test' },
            })
            expect(log).toMatchSnapshot()
        })
    })

    describe('log', () => {
        it('should have a successful post log', async () => {
            mockWrapper.getExternalInfo = jest.fn().mockReturnValue({
                networkStatus: { type: 'wifi' },
                userData: {
                    userDetails: { id: 'testId' },
                    membershipData: {
                        contentAccess: { digitalPack: true },
                    },
                },
                casCode: 'QWERTYUIOP',
                iapReceipt: true,
            })
            mockWrapper.clearLogs = jest.fn()
            mockWrapper.postLog = jest.fn()
            await log({ level: Level.INFO, message: 'test' })
            expect(mockWrapper.postLog).toHaveBeenCalled()
            expect(mockWrapper.clearLogs).toHaveBeenCalled()
        })
    })
})
