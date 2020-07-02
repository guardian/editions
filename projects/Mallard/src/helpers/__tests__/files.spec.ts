import MockDate from 'mockdate'
import { matchSummmaryToKey, issuesToDelete } from '../../helpers/files'
import { issueSummaries } from '../../../../Apps/common/src/__tests__/fixtures/IssueSummary'

describe('helpers/files', () => {
    describe('matchSummmaryToKey', () => {
        it('should return a matched IssueSummary if the key matches', () => {
            const key = 'daily-edition/2019-09-18'
            const isValidIssueSummary = matchSummmaryToKey(issueSummaries, key)
            expect(isValidIssueSummary).toEqual(issueSummaries[0])
        })

        it('should return null if the key doesnt match', () => {
            const key = 'daily-edition/2019-09-20'
            const isValidIssueSummary = matchSummmaryToKey(issueSummaries, key)
            expect(isValidIssueSummary).toEqual(null)
        })
    })

    describe('issuesToDelete', () => {
        MockDate.set('2019-08-21')
        it('should return items outside of the 7 days that dont follow the issue naming, or the issue index', async () => {
            const files = [
                'daily-edition/issues',
                'some-random-file',
                'daily-edition/2019-08-15',
                'daily-edition/2019-08-14',
            ]
            expect(await issuesToDelete(files)).toEqual([
                'some-random-file',
                'daily-edition/2019-08-14',
            ])
        })

        it("should return an empty array if there isn't any to delete", async () => {
            const files = [
                'daily-edition/2019-08-15',
                'daily-edition/2019-08-16',
            ]
            expect(await issuesToDelete(files)).toEqual([])
        })
    })
})
