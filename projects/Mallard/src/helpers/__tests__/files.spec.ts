import MockDate from 'mockdate'
import {
    matchSummmaryToKey,
    downloadAndUnzipIssue,
    issuesToDelete,
} from '../files'
import { issueSummaries } from '../../../../Apps/common/src/__tests__/fixtures/IssueSummary'

const createIssueSummary = (localId: string) => ({
    key: 'de/1-1-1',
    name: 'any',
    date: '1-1-1',
    localId,
    publishedId: '1/1',
    assets: { data: '' },
})

describe('helpers/files', () => {
    describe('matchSummmaryToKey', () => {
        it('should return a matched IssueSummary if the key matches', () => {
            const key = 'daily-edition/2019-09-18'
            const isValidIssueSummary = matchSummmaryToKey(issueSummaries, key)
            expect(isValidIssueSummary).toEqual(issueSummaries[0])
        })

        it('should return null if the key doesnt match', () => {
            const key = 'daily-edition/2019-09-20'
            const isValidIssueSummary = matchSummmaryToKey(issueSummaries, key)
            expect(isValidIssueSummary).toEqual(null)
        })
    })

    describe('downloadAndUnzipIssue', () => {
        it('should resolve the outer promise when the download runner resolves', async () => {
            const localId = '1'
            const p = downloadAndUnzipIssue(
                createIssueSummary(localId),
                'phone',
                () => {},
                () => Promise.resolve(),
                // the above promise is the main downloader that drives the outer promise
                // and also updates the progress handler
                // this is not part of the main API but passing it in tests is much easier than mocking
                // all the downloads
            )
            await expect(p).resolves.toBeUndefined()
        })
        it('should not set any statuses without the passed promise calling an updater', async () => {
            const updateStatus = jest.fn(() => {})
            const p = downloadAndUnzipIssue(
                createIssueSummary('1'),
                'phone',
                updateStatus,
                () => Promise.resolve(),
            )
            expect(updateStatus).not.toHaveBeenCalled()
            await p
        })
        it('should create new downloads when previous ones have finished', async () => {
            const localId = '1'
            const p1 = downloadAndUnzipIssue(
                createIssueSummary(localId),
                'phone',
                () => {},
                () => Promise.resolve(),
            )
            const p2 = downloadAndUnzipIssue(
                createIssueSummary(localId),
                'phone',
                () => {},
                () => Promise.resolve(),
            )
            await Promise.all([p1, p2])
            const p3 = downloadAndUnzipIssue(
                createIssueSummary(localId),
                'phone',
                () => {},
                () => Promise.resolve(),
            )
            expect(p3).not.toBe(p2)
            await p3
        })
    })

    describe('issuesToDelete', () => {
        MockDate.set('2019-08-21')
        it('should return items outside of the 7 days that dont follow the issue naming, or the issue index', async () => {
            const files = [
                'daily-edition/issues',
                'some-random-file',
                'daily-edition/2019-08-15',
                'daily-edition/2019-08-14',
            ]
            expect(await issuesToDelete(files)).toEqual([
                'some-random-file',
                'daily-edition/2019-08-14',
            ])
        })

        it("should return an empty array if there isn't any to delete", async () => {
            const files = [
                'daily-edition/2019-08-15',
                'daily-edition/2019-08-16',
            ]
            expect(await issuesToDelete(files)).toEqual([])
        })
    })
})
