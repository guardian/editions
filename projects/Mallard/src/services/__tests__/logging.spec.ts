import { Level, baseLog, toExport as blarg } from '../logging'
import MockDate from 'mockdate'

MockDate.set('2019-08-21')

describe('logging service', () => {
    describe('baseLog', () => {
        it('should return a log object that matches the snapshot', async () => {
            blarg.getExternalInfo = jest.fn().mockReturnValue({
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
    })
})
