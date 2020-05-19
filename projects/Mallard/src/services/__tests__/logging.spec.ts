import { Logging, Level } from '../logging'
import MockDate from 'mockdate'
import { ReleaseChannel, OS } from '../../../../Apps/common/src/logging'
import { NetInfoStateType } from '@react-native-community/netinfo'

jest.mock('@react-native-community/netinfo', () => ({
    fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
    NetInfoStateType: {
        unknown: 'unknown',
    },
}))
MockDate.set('2019-08-21')

const logFixture = [
    {
        timestamp: new Date(),
        level: Level.INFO,
        message: 'basic log',
        app: 'com.guardian.gce',
        version: '2.0',
        buildNumber: '678',
        release_channel: ReleaseChannel.BETA,
        os: OS.IOS,
        device: 'iPad4,1',
        networkStatus: NetInfoStateType.wifi,
        deviceId: '12345qwerty',
        signedIn: true,
        userId: null,
        digitalSub: false,
        casCode: null,
        iAP: false,
    },
]

const externalInfoFixture = {
    networkStatus: { type: 'wifi' },
    userData: {
        userDetails: { id: 'testId' },
        membershipData: {
            contentAccess: { digitalPack: true },
        },
    },
    casCode: 'QWERTYUIOP',
    iapReceipt: true,
}

describe('logging service', () => {
    describe('baseLog', () => {
        it('should return a log object that matches the snapshot', async () => {
            const loggingService = new Logging()
            loggingService.getExternalInfo = jest
                .fn()
                .mockReturnValue(externalInfoFixture)
            const log = await loggingService.baseLog({
                level: Level.INFO,
                message: 'test log',
                optionalFields: { id: 'test' },
            })
            expect(log).toMatchSnapshot()
        })
        it('should return an object with default values if they are missing and match snapshot', async () => {
            const loggingService = new Logging()
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
            const loggingService = new Logging()
            loggingService.getExternalInfo = jest
                .fn()
                .mockReturnValue(externalInfoFixture)
            loggingService.clearItems = jest.fn()
            loggingService.postLog = jest.fn()
            loggingService.hasConsent = true
            await loggingService.log({ level: Level.INFO, message: 'test' })
            expect(loggingService.postLog).toHaveBeenCalled()
            expect(loggingService.clearItems).toHaveBeenCalled()
        })
        it('should not post a log if there is no consent', async () => {
            const loggingService = new Logging()
            loggingService.getExternalInfo = jest
                .fn()
                .mockReturnValue(externalInfoFixture)
            loggingService.clearItems = jest.fn()
            loggingService.postLog = jest.fn()

            await loggingService.log({ level: Level.INFO, message: 'test' })
            expect(loggingService.postLog).not.toHaveBeenCalled()
            expect(loggingService.clearItems).not.toHaveBeenCalled()
        })
    })

    describe('postLog', () => {
        it('should increase the number of attempts if postLog fails', async () => {
            const loggingService = new Logging()
            loggingService.postLogToService = jest
                .fn()
                .mockImplementation(() => {
                    throw new Error('unable to post')
                })

            try {
                await loggingService.postLog(logFixture)
            } catch {
                expect(loggingService.numberOfAttempts).toEqual(1)
            }
        })
        it('should reset the number of attempts on a successful post', async () => {
            const loggingService = new Logging()
            loggingService.postLogToService = jest
                .fn()
                .mockReturnValue(Promise.resolve(true))
            await loggingService.postLog(logFixture)
            expect(loggingService.numberOfAttempts).toEqual(0)
        })
        it('should call clearLogs if the threshold is reached when there is an error', async () => {
            const loggingService = new Logging()
            loggingService.numberOfAttempts = 10
            loggingService.postLogToService = jest
                .fn()
                .mockImplementation(() => {
                    throw new Error('unable to post')
                })
            loggingService.clearItems = jest.fn()

            try {
                await loggingService.postLog(logFixture)
            } catch {
                expect(loggingService.numberOfAttempts).toEqual(0)
                expect(loggingService.clearItems).toHaveBeenCalled()
            }
        })
    })
})
