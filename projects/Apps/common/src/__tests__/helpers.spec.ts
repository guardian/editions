import { issueSummarySort } from '../helpers'

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
        expect(sorted.map(summary => summary.date)).toStrictEqual([
            '2019-09-30',
            '2019-09-29',
            '2019-09-27',
            '2019-09-24',
        ])
    })
})
