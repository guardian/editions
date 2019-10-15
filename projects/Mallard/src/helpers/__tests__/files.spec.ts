import { matchSummmaryToKey } from '../files'
import { issueSummaries } from '../../../../common/src/__tests__/fixtures/IssueSummary'

describe('helpers/files', () => {
    describe('matchSummmaryToKey', () => {
        it('should return a matched IssueSummary if the key matches', () => {
            const key = '2019-09-18'
            const isValidIssueSummary = matchSummmaryToKey(issueSummaries, key)
            expect(isValidIssueSummary).toEqual(issueSummaries[0])
        })

        it('should return null if the key doesnt match', () => {
            const key = '2019-09-20'
            const isValidIssueSummary = matchSummmaryToKey(issueSummaries, key)
            expect(isValidIssueSummary).toEqual(null)
        })
    })
})
