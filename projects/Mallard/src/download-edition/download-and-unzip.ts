import { IssueSummary, ImageSize } from '../../../Apps/common/src'
import { pushTracking } from 'src/push-notifications/push-tracking'
import { Feature } from '../../../Apps/common/src/logging'
import {
    downloadNamedIssueArchive,
    unzipNamedIssueArchive,
    DLStatus,
} from 'src/helpers/files'
import { errorService } from 'src/services/errors'
import ApolloClient from 'apollo-client'
import { DownloadBlockedStatus, NetInfo } from 'src/hooks/use-net-info'
import { localIssueListStore } from 'src/hooks/use-issue-on-device'
import gql from 'graphql-tag'
import { crashlyticsService } from 'src/services/crashlytics'
import { FSPaths } from 'src/paths'

type DlBlkQueryValue = { netInfo: Pick<NetInfo, 'downloadBlocked'> }
const DOWNLOAD_BLOCKED_QUERY = gql`
    {
        netInfo @client {
            downloadBlocked @client
        }
    }
`

// Cache of current downloads
const dlCache: {
    [key: string]: {
        promise: Promise<void>
        progressListeners: ((status: DLStatus) => void)[]
    }
} = {}

export const maybeListenToExistingDownload = (
    issue: IssueSummary,
    onProgress: (status: DLStatus) => void = () => {},
) => {
    const dl = dlCache[issue.localId]
    if (dlCache[issue.localId]) {
        dl.progressListeners.push(onProgress)
        return dl.promise
    }
    return false
}

export const stopListeningToExistingDownload = (
    issue: IssueSummary,
    listener: (status: DLStatus) => void,
) => {
    const dl = dlCache[issue.localId]
    if (dlCache[issue.localId]) {
        const index = dl.progressListeners.indexOf(listener)
        if (index < 0) return
        dl.progressListeners.splice(index, 1)
    }
}

// for testing
export const updateListeners = (localId: string, status: DLStatus) => {
    const listeners = (dlCache[localId] || {}).progressListeners || []
    listeners.forEach(listener => listener(status))
}

const runDownload = async (issue: IssueSummary, imageSize: ImageSize) => {
    const { assets, localId } = issue
    try {
        if (!assets) {
            await pushTracking('noAssets', 'complete', Feature.DOWNLOAD)
            return
        }

        await pushTracking(
            'attemptDataDownload',
            JSON.stringify({ localId, assets: assets.data }),
            Feature.DOWNLOAD,
        )

        const issueDataDownload = await downloadNamedIssueArchive({
            localIssueId: localId,
            assetPath: assets.data,
            filename: 'data.zip',
            withProgress: false,
        }) // just the issue json

        const dataRes = await issueDataDownload.promise

        await pushTracking('attemptDataDownload', 'completed', Feature.DOWNLOAD)

        await pushTracking(
            'attemptMediaDownload',
            JSON.stringify({ localId, assets: assets[imageSize] }),
            Feature.DOWNLOAD,
        )

        const imgDL = await downloadNamedIssueArchive({
            localIssueId: localId,
            assetPath: assets[imageSize] as string,
            filename: 'media.zip',
            withProgress: true,
        }) // just the images

        const imgRes = await imgDL.promise

        await pushTracking(
            'attemptMediaDownload',
            'completed',
            Feature.DOWNLOAD,
        )

        updateListeners(localId, {
            type: 'unzip',
            data: 'start',
        })

        try {
            /**
             * because `isIssueOnDevice` checks for the issue folder's existence
             * leave unzipping to be the last thing to do so that, if there is an issue
             * with the image downloads we don't assume the issue is on the device
             * and then block things like re-downloading if the images stopped downloading
             */

            await pushTracking('unzipData', 'start', Feature.DOWNLOAD)
            await unzipNamedIssueArchive(
                `${FSPaths.downloadIssueLocation(localId)}/data.zip`,
            )
            await pushTracking('unzipData', 'end', Feature.DOWNLOAD)
            /**
             * The last thing we do is unzip the directory that will confirm if the issue exists
             */
            await pushTracking('unzipImages', 'start', Feature.DOWNLOAD)
            await unzipNamedIssueArchive(
                `${FSPaths.downloadIssueLocation(localId)}/media.zip`,
            )
            await pushTracking('unzipImages', 'end', Feature.DOWNLOAD)
        } catch (error) {
            updateListeners(localId, { type: 'failure', data: error })
            error.message = `Unzip error: ${error.message}`
            await pushTracking(
                'unzipError',
                JSON.stringify(error),
                Feature.DOWNLOAD,
            )
            errorService.captureException(error)
            console.log('Unzip error: ', error)
        }

        await pushTracking('downloadAndUnzip', 'complete', Feature.DOWNLOAD)
        updateListeners(localId, { type: 'success' }) // null is unstarted or end
    } catch (error) {
        await pushTracking(
            'downloadAndUnzipError',
            JSON.stringify(error),
            Feature.DOWNLOAD,
        )
        errorService.captureException(error)
        crashlyticsService.captureException(error)
        updateListeners(localId, { type: 'failure', data: error })
        console.log('Download error: ', error)
    }
}

// This caches downloads so that if there is one already running you
// will get a reference to that rather promise than triggering a new one
export const downloadAndUnzipIssue = async (
    client: ApolloClient<object>,
    issue: IssueSummary,
    imageSize: ImageSize,
    onProgress: (status: DLStatus) => void = () => {},
    run = runDownload,
) => {
    const queryResult = await client.query<DlBlkQueryValue>({
        query: DOWNLOAD_BLOCKED_QUERY,
    })
    const {
        netInfo: { downloadBlocked },
    } = queryResult.data

    if (downloadBlocked !== DownloadBlockedStatus.NotBlocked) {
        await pushTracking(
            'downloadBlocked',
            DownloadBlockedStatus[downloadBlocked],
            Feature.DOWNLOAD,
        )
        errorService.captureException(
            new Error('Download Blocked: Required signal not available'),
        )
        crashlyticsService.captureException(
            new Error('Download Blocked: Required signal not available'),
        )
        return
    }

    const { localId } = issue
    const promise = maybeListenToExistingDownload(issue, onProgress)
    if (promise) return promise

    const createDownloadPromise = async () => {
        try {
            await run(issue, imageSize)
            localIssueListStore.add(localId)
        } finally {
            await pushTracking(
                'completeAndDeleteCache',
                'completed',
                Feature.DOWNLOAD,
            )
            delete dlCache[localId]
        }
    }

    const downloadPromise = createDownloadPromise()

    dlCache[localId] = {
        promise: downloadPromise,
        progressListeners: [onProgress],
    }
    return downloadPromise
}
