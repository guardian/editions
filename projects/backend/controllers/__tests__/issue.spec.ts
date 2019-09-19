import { getIssuesSummary } from '../issue'
import { IssueSummary } from '../../../common/src'
import { LIVE_PAGE_SIZE, PREVIEW_PAGE_SIZE } from '../issue'

const issueList = [
    {
        key: 'daily-edition/2019-03-22/',
        publicationDate: 'asdf',
    },
    {
        key: 'daily-edition/2019-03-23/',
        publicationDate: 'asdf',
    },
    {
        key: 'daily-edition/2019-03-26/',
        publicationDate: 'asdf',
    },
    {
        key: 'daily-edition/2019-03-24/',
        publicationDate: 'asdf',
    },
    {
        key: 'daily-edition/2019-03-25/',
        publicationDate: 'asdf',
    },
    {
        key: 'daily-edition/2019-03-27/',
        publicationDate: 'asdf',
    },
    {
        key: 'daily-edition/2019-03-28/',
        publicationDate: 'asdf',
    },
    {
        key: 'daily-edition/2019-03-29/',
        publicationDate: 'asdf',
    },
    {
        key: 'daily-edition/2019-03-30/',
        publicationDate: 'asdf',
    },
    {
        key: 'daily-edition/2019-03-31/',
        publicationDate: 'asdf',
    },
    {
        key: 'daily-edition/2019-04-01/',
        publicationDate: 'asdf',
    },
    {
        key: 'daily-edition/2019-04-02/',
        publicationDate: 'asdf',
    },
    {
        key: 'daily-edition/2019-04-03/',
        publicationDate: 'asdf',
    },
    {
        key: 'daily-edition/2019-04-04/',
        publicationDate: 'asdf',
    },
    {
        key: 'daily-edition/2019-04-05/',
        publicationDate: 'asdf',
    },
    {
        key: 'daily-edition/2019-04-06/',
        publicationDate: 'asdf',
    },
    {
        key: 'daily-edition/2019-04-07/',
        publicationDate: 'asdf',
    },
    {
        key: 'daily-edition/2019-04-08/',
        publicationDate: 'asdf',
    },
    {
        key: 'daily-edition/2019-04-09/',
        publicationDate: 'asdf',
    },
    {
        key: 'daily-edition/2019-04-10/',
        publicationDate: 'asdf',
    },
    {
        key: 'daily-edition/2019-04-11/',
        publicationDate: 'asdf',
    },
    {
        key: 'daily-edition/2019-04-12/',
        publicationDate: 'asdf',
    },
    {
        key: 'daily-edition/2019-04-13/',
        publicationDate: 'asdf',
    },
    {
        key: 'daily-edition/2019-04-14/',
        publicationDate: 'asdf',
    },
    {
        key: 'daily-edition/2019-04-15/',
        publicationDate: 'asdf',
    },
    {
        key: 'daily-edition/2019-04-16/',
        publicationDate: 'asdf',
    },
    {
        key: 'daily-edition/2019-04-17/',
        publicationDate: 'asdf',
    },
    {
        key: 'daily-edition/2019-04-18/',
        publicationDate: 'asdf',
    },
    {
        key: 'daily-edition/2019-04-19/',
        publicationDate: 'asdf',
    },
    {
        key: 'daily-edition/2019-04-20/',
        publicationDate: 'asdf',
    },
    {
        key: 'daily-edition/2019-04-21/',
        publicationDate: 'asdf',
    },
    {
        key: 'daily-edition/2019-04-22/',
        publicationDate: 'asdf',
    },
    {
        key: 'daily-edition/2019-04-23/',
        publicationDate: 'asdf',
    },
    {
        key: 'daily-edition/2019-04-25/',
        publicationDate: 'asdf',
    },
    {
        key: 'daily-edition/2019-04-24/',
        publicationDate: 'asdf',
    },
]

jest.mock('../../s3', () => ({
    s3List: () => Promise.resolve(issueList),
}))

const getNthKey = (n: number) => {
    const [edition, key] = issueList[n].key.split('/')
    return `${edition}/${key}`
}

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
