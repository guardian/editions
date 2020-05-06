import { Level, log, privateFunctions as mockWrapper } from '../logging'
import MockDate from 'mockdate'

jest.mock('@react-native-community/netinfo', () => ({
    fetch: jest.fn(() => Promise.resolve(false)),
    NetInfoStateType: {
        unknown: 'unknown',
    },
}))
MockDate.set('2019-08-21')

describe('logging service - Offline', () => {
    describe('log', () => {
        it('should save queued logs when there is no internet connection', async () => {
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
            mockWrapper.saveQueuedLogs = jest.fn()
            await log({ level: Level.INFO, message: 'test' })
            expect(mockWrapper.saveQueuedLogs).toHaveBeenCalled()
        })
    })
})
