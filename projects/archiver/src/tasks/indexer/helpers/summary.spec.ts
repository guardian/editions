import { IssuePublicationIdentifier, IssueIdentifier } from '../../../../common'
import { getOtherRecentIssues } from './summary'

describe('getOtherRecentIssues', () => {
    const usEdition = 'american-edition'
    it('should get most recent issues in a 7 items window time from all issues', () => {
        const currentlyPublishing: IssuePublicationIdentifier = {
            edition: usEdition,
            version: '2019-10-04T16:08:35.951Z',
            issueDate: '2019-10-09',
        }

        const allEditionsIssues: IssueIdentifier[] = [
            { edition: usEdition, issueDate: '2019-10-01' },
            { edition: usEdition, issueDate: '2019-10-02' },
            { edition: usEdition, issueDate: '2019-10-03' },
            { edition: usEdition, issueDate: '2019-10-04' },
            { edition: usEdition, issueDate: '2019-10-05' },
            { edition: usEdition, issueDate: '2019-10-06' },
            { edition: usEdition, issueDate: '2019-09-07' },
            { edition: usEdition, issueDate: '2019-09-08' },
        ]

        const actual = getOtherRecentIssues(
            currentlyPublishing,
            allEditionsIssues,
        )

        const expected = [
            { edition: usEdition, issueDate: '2019-10-06' },
            { edition: usEdition, issueDate: '2019-10-05' },
            { edition: usEdition, issueDate: '2019-10-04' },
            { edition: usEdition, issueDate: '2019-10-03' },
            { edition: usEdition, issueDate: '2019-10-02' },
            { edition: usEdition, issueDate: '2019-10-01' },
            { edition: usEdition, issueDate: '2019-09-08' },
        ]

        expect(actual).toStrictEqual(expected)
    })

    it('should throw error if wrong input was provided (issue list with more then one edition)', () => {
        const currentlyPublishing: IssuePublicationIdentifier = {
            edition: usEdition,
            version: '2019-10-04T16:08:35.951Z',
            issueDate: '2019-10-09',
        }

        const allEditionsIssues: IssueIdentifier[] = [
            { edition: usEdition, issueDate: '2019-10-01' },
            { edition: usEdition, issueDate: '2019-10-02' },
            { edition: 'daily-edition', issueDate: '2019-10-03' },
        ]

        expect(() => {
            getOtherRecentIssues(currentlyPublishing, allEditionsIssues)
        }).toThrowError(
            'getIssuesByEdition function call failed, issues with more then one edition type received',
        )
    })
})
