import { issueWindow } from '../getIssues'

describe('issueWindow', () => {
    it('should sort issues', () => {
        const sorted = issueWindow(
            [
                { edition: 'daily-edition', issueDate: '2019-09-30' },
                { edition: 'daily-edition', issueDate: '2019-09-29' },
                { edition: 'daily-edition', issueDate: '2019-09-27' },
            ],
            3,
        )
        expect(sorted.length).toBe(3)
        expect(sorted).toStrictEqual([
            { edition: 'daily-edition', issueDate: '2019-09-30' },
            { edition: 'daily-edition', issueDate: '2019-09-29' },
            { edition: 'daily-edition', issueDate: '2019-09-27' },
        ])
    })

    it('should cap the response to the most recent issues', () => {
        const sorted = issueWindow(
            [
                { edition: 'daily-edition', issueDate: '2019-09-30' },
                { edition: 'daily-edition', issueDate: '2019-09-28' },
                { edition: 'daily-edition', issueDate: '2019-09-29' },
                { edition: 'daily-edition', issueDate: '2019-09-24' },
                { edition: 'daily-edition', issueDate: '2019-09-27' },
            ],
            3,
        )
        expect(sorted.length).toBe(3)
        expect(sorted).toStrictEqual([
            { edition: 'daily-edition', issueDate: '2019-09-30' },
            { edition: 'daily-edition', issueDate: '2019-09-29' },
            { edition: 'daily-edition', issueDate: '2019-09-28' },
        ])
    })
})
