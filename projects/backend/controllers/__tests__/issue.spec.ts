import { getIssuesSummary } from '../issue'
import { IssueSummary } from '../../../Apps/common/src'
import { LIVE_PAGE_SIZE, PREVIEW_PAGE_SIZE } from '../issue'

const dailyEdition = 'daily-edition'

const issueList = [
    {
        key: `${dailyEdition}/2019-03-22/`,
        lastModified: '2019-03-22',
    },
    {
        key: `${dailyEdition}/2019-03-23/`,
        lastModified: '2019-03-23',
    },
    {
        key: `${dailyEdition}/2019-03-26/`,
        lastModified: '2019-03-26',
    },
    {
        key: `${dailyEdition}/2019-03-24/`,
        lastModified: '2019-03-24',
    },
    {
        key: `${dailyEdition}/2019-03-25/`,
        lastModified: '2019-03-25',
    },
    {
        key: `${dailyEdition}/2019-03-27/`,
        lastModified: '2019-03-27',
    },
    {
        key: `${dailyEdition}/2019-03-28/`,
        lastModified: '2019-03-28',
    },
    {
        key: `${dailyEdition}/2019-03-29/`,
        lastModified: '2019-03-29',
    },
    {
        key: `${dailyEdition}/2019-03-30/`,
        lastModified: '2019-03-30',
    },
    {
        key: `${dailyEdition}/2019-03-31/`,
        lastModified: '2019-03-31',
    },
    {
        key: `${dailyEdition}/2019-04-01/`,
        lastModified: '2019-04-01',
    },
    {
        key: `${dailyEdition}/2019-04-02/`,
        lastModified: '2019-04-02',
    },
    {
        key: `${dailyEdition}/2019-04-03/`,
        lastModified: '2019-04-03',
    },
    {
        key: `${dailyEdition}/2019-04-04/`,
        lastModified: '2019-04-04',
    },
    {
        key: `${dailyEdition}/2019-04-05/`,
        lastModified: '2019-04-05',
    },
    {
        key: `${dailyEdition}/2019-04-06/`,
        lastModified: '2019-04-06',
    },
    {
        key: `${dailyEdition}/2019-04-07/`,
        lastModified: '2019-04-07',
    },
    {
        key: `${dailyEdition}/2019-04-08/`,
        lastModified: '2019-04-08',
    },
    {
        key: `${dailyEdition}/2019-04-09/`,
        lastModified: '2019-04-09',
    },
    {
        key: `${dailyEdition}/2019-04-10/`,
        lastModified: '2019-04-10',
    },
    {
        key: `${dailyEdition}/2019-04-11/`,
        lastModified: '2019-04-11',
    },
    {
        key: `${dailyEdition}/2019-04-12/`,
        lastModified: '2019-04-12',
    },
    {
        key: `${dailyEdition}/2019-04-13/`,
        lastModified: '2019-04-13',
    },
    {
        key: `${dailyEdition}/2019-04-14/`,
        lastModified: '2019-04-14',
    },
    {
        key: `${dailyEdition}/2019-04-15/`,
        lastModified: '2019-04-15',
    },
    {
        key: `${dailyEdition}/2019-04-16/`,
        lastModified: '2019-04-16',
    },
    {
        key: `${dailyEdition}/2019-04-17/`,
        lastModified: '2019-04-17',
    },
    {
        key: `${dailyEdition}/2019-04-18/`,
        lastModified: '2019-04-18',
    },
    {
        key: `${dailyEdition}/2019-04-19/`,
        lastModified: '2019-04-19',
    },
    {
        key: `${dailyEdition}/2019-04-20/`,
        lastModified: '2019-04-20',
    },
    {
        key: `${dailyEdition}/2019-04-21/`,
        lastModified: '2019-04-21',
    },
    {
        key: `${dailyEdition}/2019-04-22/`,
        lastModified: '2019-04-22',
    },
    {
        key: `${dailyEdition}/2019-04-23/`,
        lastModified: '2019-04-23',
    },
    {
        key: `${dailyEdition}/2019-04-25/`,
        lastModified: '2019-04-25',
    },
    {
        key: `${dailyEdition}/2019-04-24/`,
        lastModified: '2019-04-24',
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
        const issues = await getIssuesSummary(dailyEdition, isPreview)
        expect(issues).toHaveLength(7)

        const issues2 = await getIssuesSummary(dailyEdition, isPreview)
        expect(issues2).toHaveLength(LIVE_PAGE_SIZE)
    })

    it('returns the correct numer of issues when in preview stage', async () => {
        const isPreview = true
        const issues = await getIssuesSummary(dailyEdition, isPreview)
        expect(issues).toHaveLength(PREVIEW_PAGE_SIZE)
    })

    it('returns the most recent issues', async () => {
        const isPreview = false
        const issues = await getIssuesSummary(dailyEdition, isPreview)
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
