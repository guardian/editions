import { getIssuesSummary } from '../issue'
import { IssueSummary } from '../../../common/src'
import { LIVE_PAGE_SIZE, PREVIEW_PAGE_SIZE } from '../issue'

const issueList = [
    'daily-edition/2019-03-22/',
    'daily-edition/2019-03-23/',
    'daily-edition/2019-03-26/',
    'daily-edition/2019-03-24/',
    'daily-edition/2019-03-25/',
    'daily-edition/2019-03-27/',
    'daily-edition/2019-03-28/',
    'daily-edition/2019-03-29/',
    'daily-edition/2019-03-30/',
    'daily-edition/2019-03-31/',
    'daily-edition/2019-04-01/',
    'daily-edition/2019-04-02/',
    'daily-edition/2019-04-03/',
    'daily-edition/2019-04-04/',
    'daily-edition/2019-04-05/',
    'daily-edition/2019-04-06/',
    'daily-edition/2019-04-07/',
    'daily-edition/2019-04-08/',
    'daily-edition/2019-04-09/',
    'daily-edition/2019-04-10/',
    'daily-edition/2019-04-11/',
    'daily-edition/2019-04-12/',
    'daily-edition/2019-04-13/',
    'daily-edition/2019-04-14/',
    'daily-edition/2019-04-15/',
    'daily-edition/2019-04-16/',
    'daily-edition/2019-04-17/',
    'daily-edition/2019-04-18/',
    'daily-edition/2019-04-19/',
    'daily-edition/2019-04-20/',
    'daily-edition/2019-04-21/',
    'daily-edition/2019-04-22/',
    'daily-edition/2019-04-23/',
    'daily-edition/2019-04-25/',
    'daily-edition/2019-04-24/',
]

jest.mock('../../s3', () => ({
    s3List: () => Promise.resolve(issueList),
}))

const getNthKey = (n: number) => issueList[n].split('/')[1]

describe('getIssuesSummary', () => {
    it('returns the correct number of issues when on live stage', async () => {
        const isPreview = false
        const issues = await getIssuesSummary(isPreview)
        expect(issues).toHaveLength(7)

        const issues2 = await getIssuesSummary(isPreview)
        expect(issues2).toHaveLength(LIVE_PAGE_SIZE)
    })

    it('returns the correct numer of issues when in preview stage', async () => {
        const isPreview = true
        const issues = await getIssuesSummary(isPreview)
        expect(issues).toHaveLength(PREVIEW_PAGE_SIZE)
    })

    it('returns the most recent issues', async () => {
        const isPreview = false
        const issues = await getIssuesSummary(isPreview)
        expect(issues).not.toHaveFailed(issues)
        expect((issues as IssueSummary[]).map(i => i.key)).toEqual([
            getNthKey(33),
            getNthKey(34),
            getNthKey(32),
            getNthKey(31),
            getNthKey(30),
            getNthKey(29),
            getNthKey(28),
        ])
    })
})
