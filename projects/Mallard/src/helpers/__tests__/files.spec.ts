import { findIssueSummaryByKey } from '../../helpers/files'
import { issueSummaries } from '../../../../Apps/common/src/__tests__/fixtures/IssueSummary'

describe('helpers/files', () => {
    describe('matchSummmaryToKey', () => {
        it('should return a matched IssueSummary if the key matches', () => {
            const key = 'daily-edition/2019-09-18'
            const isValidIssueSummary = findIssueSummaryByKey(
                issueSummaries,
                key,
            )
            expect(isValidIssueSummary).toEqual(issueSummaries[0])
        })

        it('should return null if the key doesnt match', () => {
            const key = 'daily-edition/2019-09-20'
            const isValidIssueSummary = findIssueSummaryByKey(
                issueSummaries,
                key,
            )
            expect(isValidIssueSummary).toEqual(null)
        })
    })

    describe('issuesToDelete', () => {
        beforeEach(() => {
            jest.resetModules()
        })

        it('should return items outside of the 7 latest issues', async () => {
            jest.mock('src/helpers/settings', () => ({
                getSetting: () => 7,
            }))
            const { issuesToDelete } = await require('../../helpers/files')

            const files = [
                'daily-edition/issues',
                'some-random-file',
                'daily-edition/2019-08-15',
                'daily-edition/2019-08-14',
                'daily-edition/2020-07-14',
                'daily-edition/2020-07-15',
                'daily-edition/2020-07-16',
                'daily-edition/2020-07-17',
                'daily-edition/2020-07-18',
                'daily-edition/2020-07-19',
                'daily-edition/2020-07-20',
            ]

            expect(await issuesToDelete(files)).toEqual([
                'some-random-file',
                'daily-edition/2019-08-15',
                'daily-edition/2019-08-14',
            ])
        })

        it('should return items outside of the 3 latest issues', async () => {
            jest.mock('src/helpers/settings', () => ({
                getSetting: () => 3,
            }))
            const { issuesToDelete } = await require('../../helpers/files')

            const files = [
                'daily-edition/issues',
                'some-random-file',
                'daily-edition/2019-08-15',
                'daily-edition/2019-08-14',
                'daily-edition/2020-07-14',
                'daily-edition/2020-07-15',
                'daily-edition/2020-07-16',
                'daily-edition/2020-07-17',
                'daily-edition/2020-07-18',
                'daily-edition/2020-07-19',
            ]
            expect(await issuesToDelete(files)).toEqual([
                'some-random-file',
                'daily-edition/2020-07-16',
                'daily-edition/2020-07-15',
                'daily-edition/2020-07-14',
                'daily-edition/2019-08-15',
                'daily-edition/2019-08-14',
            ])
        })

        it("should return an empty array if there isn't any to delete", async () => {
            jest.mock('src/helpers/settings', () => ({
                getSetting: () => 3,
            }))
            const { issuesToDelete } = await require('../../helpers/files')

            const files = [
                'daily-edition/2019-08-15',
                'daily-edition/2019-08-16',
            ]
            expect(await issuesToDelete(files)).toEqual([])
        })
    })
})
