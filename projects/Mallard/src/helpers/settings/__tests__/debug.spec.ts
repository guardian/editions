import { fetchEditionMenuEnabledSetting } from '../debug'
import { remoteConfigService } from 'src/services/remote-config'

jest.mock('src/services/remote-config', () => ({
    remoteConfigService: {
        getBoolean: jest.fn(),
    },
}))

describe('debug settings', () => {
    describe('when user in Beta', () => {
        const isInBeta = true
        it('edition switch should be On when remote switch is On', async () => {
            remoteConfigService.getBoolean = jest.fn().mockReturnValue(true)
            const result = await fetchEditionMenuEnabledSetting(isInBeta)
            expect(result).toEqual(true)
        })
        it('edition switch should be On even when remote switch is Off', async () => {
            remoteConfigService.getBoolean = jest.fn().mockReturnValue(false)
            const result = await fetchEditionMenuEnabledSetting(isInBeta)
            expect(result).toEqual(true)
        })
    })
    describe('when user NOT in Beta', () => {
        const isInBeta = false
        it('edition switch should be On when remote switch is On', async () => {
            remoteConfigService.getBoolean = jest.fn().mockReturnValue(true)
            const result = await fetchEditionMenuEnabledSetting(isInBeta)
            expect(result).toEqual(true)
        })
        it('edition switch should be Off when remote switch is Off', async () => {
            remoteConfigService.getBoolean = jest.fn().mockReturnValue(false)
            const result = await fetchEditionMenuEnabledSetting(isInBeta)
            expect(result).toEqual(false)
        })
    })
})
