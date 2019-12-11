import { IssuePublicationIdentifier, IssueSummary } from '../../../../common'
import { getIssueSummaryInternal } from '../../../../src/tasks/indexer/helpers/get-issue-summary'

describe('getIssueSummaryInternal', () => {
    const assetKeys = [
        'zips/american-edition/2019-10-09/2019-10-08T14:07:37.084Z/data.zip',
        'zips/american-edition/2019-10-09/2019-10-08T14:07:37.084Z/phone.zip',
        'zips/american-edition/2019-10-09/2019-10-08T14:07:37.084Z/tablet.zip',
        'zips/american-edition/2019-10-09/2019-10-08T14:07:37.084Z/tabletL.zip',
        'zips/american-edition/2019-10-09/2019-10-08T14:07:37.084Z/tabletXL.zip',
    ]

    it('should return IssueSummary', () => {
        const issue: IssuePublicationIdentifier = {
            edition: 'american-edition',
            version: '2019-10-04T16:08:35.951Z',
            issueDate: '2019-10-09',
        }

        const actual = getIssueSummaryInternal(issue, assetKeys)

        const expected: IssueSummary = {
            key: 'american-edition/2019-10-09',
            localId: 'american-edition/2019-10-09',
            publishedId: 'american-edition/2019-10-09/2019-10-04T16:08:35.951Z',
            name: 'American Edition',
            date: '2019-10-09',
            assets: {
                data:
                    'zips/american-edition/2019-10-09/2019-10-08T14:07:37.084Z/data.zip',
                phone:
                    'zips/american-edition/2019-10-09/2019-10-08T14:07:37.084Z/phone.zip',
                tablet:
                    'zips/american-edition/2019-10-09/2019-10-08T14:07:37.084Z/tablet.zip',
                tabletL:
                    'zips/american-edition/2019-10-09/2019-10-08T14:07:37.084Z/tabletL.zip',
                tabletXL:
                    'zips/american-edition/2019-10-09/2019-10-08T14:07:37.084Z/tabletXL.zip',
            },
        }

        expect(actual).toStrictEqual(expected)
    })

    it('should return undefined if issue date was invalid', () => {
        const issueWithIncorrectDate: IssuePublicationIdentifier = {
            edition: 'american-edition',
            version: '2019-10-04T16:08:35.951Z',
            issueDate: '2019-1011-09',
        }

        const actual = getIssueSummaryInternal(
            issueWithIncorrectDate,
            assetKeys,
        )

        expect(actual).toBeUndefined()
    })

    it('should return undefined if there was no assets', () => {
        const issueWithIncorrectDate: IssuePublicationIdentifier = {
            edition: 'american-edition',
            version: '2019-10-04T16:08:35.951Z',
            issueDate: '2019-10-09',
        }

        const actual = getIssueSummaryInternal(issueWithIncorrectDate, [])

        expect(actual).toBeUndefined()
    })
})
