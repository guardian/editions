import { getPublishedVersionInternal } from '../../../../src/tasks/indexer/helpers/get-published-version'
import { IssuePublicationWithStatus } from '../../../../src/services/status'
import { IssueIdentifier } from '../../../../common'
import moment = require('moment')

const dt = '2019-09-30T16:45:23.699Z'

const issue: IssueIdentifier = {
    edition: 'daily-edition',
    issueDate: '2019-09-09',
}

describe('getPublishedVersionInternal', () => {
    it('should return most recent valid issue version', () => {
        const publicationStatuses: IssuePublicationWithStatus[] = [
            {
                ...issue,
                version: '2019-09-30T16:45:23.699Z',
                status: 'bundled',
                updated: moment(dt).toDate(),
            },
            {
                ...issue,
                version: '2019-09-30T17:45:23.699Z',
                status: 'indexed',
                updated: moment(dt)
                    .add(1, 'hours')
                    .toDate(),
            },
            {
                ...issue,
                version: '2019-09-30T18:45:23.699Z',
                status: 'notified',
                updated: moment(dt)
                    .add(2, 'hours')
                    .toDate(),
            },
        ]

        const actual = getPublishedVersionInternal(publicationStatuses, issue)

        const expected = {
            ...issue,
            version: '2019-09-30T18:45:23.699Z',
            status: 'notified',
            updated: moment(dt)
                .add(2, 'hours')
                .toDate(),
        }

        expect(actual).toStrictEqual(expected)
    })
    it('should return most recent valid issue version and ignore most recent entries which status was not of publish type', () => {
        const publicationStatuses: IssuePublicationWithStatus[] = [
            {
                ...issue,
                version: '2019-09-30T16:45:23.699Z',
                status: 'bundled',
                updated: moment(dt).toDate(),
            },
            {
                ...issue,
                version: '2019-09-30T17:45:23.699Z',
                status: 'indexed',
                updated: moment(dt)
                    .add(1, 'hours')
                    .toDate(),
            },
            {
                ...issue,
                version: '2019-09-30T18:45:23.699Z',
                status: 'notified',
                updated: moment(dt)
                    .add(2, 'hours')
                    .toDate(),
            },
            {
                ...issue,
                version: '2019-09-30T19:45:23.699Z',
                status: 'started',
                updated: moment(dt)
                    .add(3, 'hours')
                    .toDate(),
            },
            {
                ...issue,
                version: '2019-09-30T20:45:23.699Z',
                status: 'assembled',
                updated: moment(dt)
                    .add(4, 'hours')
                    .toDate(),
            },
        ]

        const actual = getPublishedVersionInternal(publicationStatuses, issue)

        const expected = {
            ...issue,
            version: '2019-09-30T18:45:23.699Z',
            status: 'notified',
            updated: moment(dt)
                .add(2, 'hours')
                .toDate(),
        }

        expect(actual).toStrictEqual(expected)
    })

    it('should return undefined if all statuses were not of publish type', () => {
        const publicationStatuses: IssuePublicationWithStatus[] = [
            {
                ...issue,
                version: '2019-09-30T16:45:23.699Z',
                status: 'started',
                updated: moment(dt).toDate(),
            },
            {
                ...issue,
                version: '2019-09-30T17:45:23.699Z',
                status: 'assembled',
                updated: moment(dt)
                    .add(1, 'hours')
                    .toDate(),
            },
            {
                ...issue,
                version: '2019-09-30T18:45:23.699Z',
                status: 'unknown',
                updated: moment(dt)
                    .add(2, 'hours')
                    .toDate(),
            },
        ]

        const actual = getPublishedVersionInternal(publicationStatuses, issue)

        expect(actual).toBe(undefined)
    })
})
