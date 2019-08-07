import { getIssuesSummary } from '../issue'
import { IssueSummary } from '../../../common/src'

const issueList = [
    'daily-edition/2019-03-22/',
    'daily-edition/2019-03-23/',
    'daily-edition/2019-03-26/',
    'daily-edition/2019-03-24/',
    'daily-edition/2019-03-25/',
]

jest.mock('../../s3', () => ({
    s3List: () => Promise.resolve(issueList),
}))

const getNthKey = (n: number) => issueList[n].split('/')[1]

describe('getIssuesSummary', () => {
    it('returns the correct number of issues', async () => {
        const issues = await getIssuesSummary()
        expect(issues).toHaveLength(5)

        const issues2 = await getIssuesSummary()
        expect(issues2).toHaveLength(5)
    })

    it('returns the most recent issues', async () => {
        const issues = await getIssuesSummary()
        expect(issues).not.toHaveFailed(issues)
    })
})
