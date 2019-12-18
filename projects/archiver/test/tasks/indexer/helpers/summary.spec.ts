import { IssuePublicationIdentifier, IssueIdentifier } from '../../../../common'
import { getOtherRecentIssues } from '../../../../src/tasks/indexer/helpers/summary'

describe('getOtherRecentIssues', () => {
    const usEdition = 'american-edition'
    it('should get most recent issues in a 30 items window time from all issues', () => {
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
            { edition: usEdition, issueDate: '2019-09-09' },
            { edition: usEdition, issueDate: '2019-09-10' },
            { edition: usEdition, issueDate: '2019-09-11' },
            { edition: usEdition, issueDate: '2019-09-12' },
            { edition: usEdition, issueDate: '2019-09-13' },
            { edition: usEdition, issueDate: '2019-09-14' },
            { edition: usEdition, issueDate: '2019-09-15' },
            { edition: usEdition, issueDate: '2019-09-16' },
            { edition: usEdition, issueDate: '2019-09-17' },
            { edition: usEdition, issueDate: '2019-09-18' },
            { edition: usEdition, issueDate: '2019-09-19' },
            { edition: usEdition, issueDate: '2019-09-20' },
            { edition: usEdition, issueDate: '2019-09-21' },
            { edition: usEdition, issueDate: '2019-09-22' },
            { edition: usEdition, issueDate: '2019-09-23' },
            { edition: usEdition, issueDate: '2019-09-24' },
            { edition: usEdition, issueDate: '2019-09-25' },
            { edition: usEdition, issueDate: '2019-09-26' },
            { edition: usEdition, issueDate: '2019-09-27' },
            { edition: usEdition, issueDate: '2019-09-28' },
            { edition: usEdition, issueDate: '2019-09-29' },
            { edition: usEdition, issueDate: '2019-09-30' },
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
            { edition: usEdition, issueDate: '2019-09-30' },
            { edition: usEdition, issueDate: '2019-09-29' },
            { edition: usEdition, issueDate: '2019-09-28' },
            { edition: usEdition, issueDate: '2019-09-27' },
            { edition: usEdition, issueDate: '2019-09-26' },
            { edition: usEdition, issueDate: '2019-09-25' },
            { edition: usEdition, issueDate: '2019-09-24' },
            { edition: usEdition, issueDate: '2019-09-23' },
            { edition: usEdition, issueDate: '2019-09-22' },
            { edition: usEdition, issueDate: '2019-09-21' },
            { edition: usEdition, issueDate: '2019-09-20' },
            { edition: usEdition, issueDate: '2019-09-19' },
            { edition: usEdition, issueDate: '2019-09-18' },
            { edition: usEdition, issueDate: '2019-09-17' },
            { edition: usEdition, issueDate: '2019-09-16' },
            { edition: usEdition, issueDate: '2019-09-15' },
            { edition: usEdition, issueDate: '2019-09-14' },
            { edition: usEdition, issueDate: '2019-09-13' },
            { edition: usEdition, issueDate: '2019-09-12' },
            { edition: usEdition, issueDate: '2019-09-11' },
            { edition: usEdition, issueDate: '2019-09-10' },
            { edition: usEdition, issueDate: '2019-09-09' },
            { edition: usEdition, issueDate: '2019-09-08' },
            { edition: usEdition, issueDate: '2019-09-07' },
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
