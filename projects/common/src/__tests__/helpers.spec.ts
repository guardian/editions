import { defaultRegionalEditions } from '../editions-defaults'
import { getEditionIds, issueSummarySort } from '../helpers'
import { editionsListFixture } from '../fixtures/editions-fixtures'

describe('issueSummarySort', () => {
    it('should sort issues', () => {
        const baseIssueSummary = {
            name: 'daily-edition',
            assets: {
                data: '',
                phone: '',
                tablet: '',
                tabletL: '',
                tabletXL: '',
            },
            key: 'a key',
            localId: 'localId',
            publishedId: 'publishedId',
        }
        const issues = [
            { ...baseIssueSummary, date: '2019-09-27' },
            { ...baseIssueSummary, date: '2019-09-30' },
            { ...baseIssueSummary, date: '2019-09-29' },
            { ...baseIssueSummary, date: '2019-09-24' },
        ]

        const sorted = issueSummarySort(issues)
        expect(sorted.length).toBe(4)
        expect(sorted.map((summary) => summary.date)).toStrictEqual([
            '2019-09-30',
            '2019-09-29',
            '2019-09-27',
            '2019-09-24',
        ])
    })
})

describe('getEditionIds', () => {
    it('should get regional and special edition ids', () => {
        const ids = getEditionIds(editionsListFixture)

        expect(ids).toEqual([
            'daily-edition',
            'australian-edition',
            'special-edition',
        ])
    })

    it('should always include defaultRegionalEditions', () => {
        const ids = getEditionIds(null)

        expect(ids).toEqual(defaultRegionalEditions.map((e) => e.edition))
    })
})
