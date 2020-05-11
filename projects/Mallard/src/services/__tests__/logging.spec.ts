import { loggingService, Level } from '../logging'
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
            loggingService.getExternalInfo = jest.fn().mockReturnValue({
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
            const log = await loggingService.baseLog({
                level: Level.INFO,
                message: 'test log',
                optionalFields: { id: 'test' },
            })
            expect(log).toMatchSnapshot()
        })
        it('should return an object with default values if they are missing and match snapshot', async () => {
            loggingService.getExternalInfo = jest.fn().mockReturnValue({
                networkStatus: null,
                userData: null,
                casCode: null,
                iapReceipt: null,
            })
            const log = await loggingService.baseLog({
                level: Level.INFO,
                message: 'test log',
                optionalFields: { id: 'test' },
            })
            expect(log).toMatchSnapshot()
        })
    })

    describe('log', () => {
        it('should have a successful post log', async () => {
            loggingService.getExternalInfo = jest.fn().mockReturnValue({
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
            loggingService.clearLogs = jest.fn()
            loggingService.postLog = jest.fn()
            loggingService.hasConsent = true
            await loggingService.log({ level: Level.INFO, message: 'test' })
            expect(loggingService.postLog).toHaveBeenCalled()
            expect(loggingService.clearLogs).toHaveBeenCalled()
        })
        it('should not post a log if there is no consent', async () => {
            loggingService.getExternalInfo = jest.fn().mockReturnValue({
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
            loggingService.clearLogs = jest.fn()
            loggingService.postLog = jest.fn()
            loggingService.hasConsent = false
            await loggingService.log({ level: Level.INFO, message: 'test' })
            expect(loggingService.postLog).not.toHaveBeenCalled()
            expect(loggingService.clearLogs).not.toHaveBeenCalled()
        })
    })
})
