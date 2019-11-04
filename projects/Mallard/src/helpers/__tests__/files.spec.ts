import {
    matchSummmaryToKey,
    downloadAndUnzipIssue,
    DLStatus,
    updateListeners,
} from '../files'
import { issueSummaries } from '../../../../common/src/__tests__/fixtures/IssueSummary'

function createRunner(id: string) {
    let resolve = () => {}
    let reject = () => {}

    return {
        runner: () =>
            new Promise<void>((res, rej) => {
                resolve = res
                reject = rej
            }),
        update: (status: DLStatus) => {
            updateListeners(id, status)
            if (status.type === 'success') {
                resolve()
            } else if (status.type === 'failure') {
                reject()
            }
        },
    }
}

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

        it('should return existing download promises if they are unresolved when trying to download the same issue', async () => {
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

            //
            expect(p1).toBe(p2)

            await Promise.all([p1, p2])
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

        it('should still register update handlers to the existing download when returning the same download promise', async () => {
            let status1: DLStatus | null = null
            let status2: DLStatus | null = null

            function updateStatus1(next: DLStatus) {
                status1 = next
            }

            function updateStatus2(next: DLStatus) {
                status2 = next
            }

            const localId = '1'

            const runner = createRunner(localId)

            const p1 = downloadAndUnzipIssue(
                createIssueSummary(localId),
                'phone',
                updateStatus1,
                runner.runner,
            )

            const p2 = downloadAndUnzipIssue(
                createIssueSummary(localId),
                'phone',
                updateStatus2,
                runner.runner, // this should not be called again so we can pass the same one here
            )

            // The runner passes the statuses through to all the handler, despite
            // one using the cached promise from before
            runner.update({ type: 'download', data: 50 })

            expect(status1).toMatchObject({ type: 'download', data: 50 })
            expect(status2).toMatchObject({ type: 'download', data: 50 })

            runner.update({ type: 'success' })

            // these should both now be resolved when the inner runner promise resolves
            await Promise.all([p1, p2])
        })
    })
})
