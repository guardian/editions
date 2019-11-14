import { unzip } from 'react-native-zip-archive'
import RNFetchBlob from 'rn-fetch-blob'
import { Issue } from 'src/common'
import { getIssueSummary } from 'src/hooks/use-issue-summary'
import { FSPaths } from 'src/paths'
import { ImageSize, IssueSummary } from '../../../common/src'
import { lastSevenDays, todayAsKey } from './issues'
import { imageForScreenSize } from './screen'
import { getSetting } from './settings'
import { defaultSettings } from './settings/defaults'
import { errorService } from 'src/services/errors'
import { sendComponentEvent, Action, ComponentType } from '../services/ophan'
import { londonTime } from './date'
import { pushTracking } from 'src/helpers/push-tracking'
import { localIssueListStore } from 'src/hooks/use-issue-on-device'

interface BasicFile {
    filename: string
    path: string
    size: number
    id: string
}
interface OtherFile extends BasicFile {
    type: 'other' | 'archive' | 'json'
}
interface IssueFile extends BasicFile {
    issue: Issue
    type: 'issue'
}

export type File = OtherFile | IssueFile
export const fileIsIssue = (file: File): file is IssueFile =>
    file.type === 'issue'

export const ensureDirExists = (dir: string): Promise<void> =>
    RNFetchBlob.fs.mkdir(dir).catch(() => Promise.resolve())

/*
We always try to prep the file system before accessing issuesDir
*/
export const prepFileSystem = (): Promise<void> =>
    ensureDirExists(FSPaths.issuesDir).then(() =>
        ensureDirExists(`${FSPaths.issuesDir}/daily-edition`),
    )

export const deleteIssueFiles = async (): Promise<void> => {
    await RNFetchBlob.fs.unlink(FSPaths.issuesDir)
    localIssueListStore.reset()
    await prepFileSystem()
}

export const getJson = <T extends any>(path: string): Promise<T> =>
    RNFetchBlob.fs.readFile(path, 'utf8').then(d => JSON.parse(d))

export const downloadNamedIssueArchive = async (
    localIssueId: Issue['localId'],
    assetPath: string,
) => {
    const apiUrl = await getSetting('apiUrl')
    const zipUrl = `${apiUrl}${assetPath}`
    const returnable = RNFetchBlob.config({
        fileCache: true,
        overwrite: true,
        IOSBackgroundTask: true,
    }).fetch('GET', zipUrl)
    return {
        promise: returnable.then(async res => {
            await prepFileSystem()
            await ensureDirExists(FSPaths.issueRoot(localIssueId))
            return res
        }),
        cancel: returnable.cancel,
        progress: returnable.progress,
    }
}

export const unzipNamedIssueArchive = (zipFilePath: string) => {
    const outputPath = FSPaths.issuesDir

    return unzip(zipFilePath, outputPath).then(() => {
        return RNFetchBlob.fs.unlink(zipFilePath)
    })
}

/**
 * Only return true if we have both directories
 */
export const isIssueOnDevice = async (
    localIssueId: Issue['localId'],
): Promise<boolean> =>
    (await Promise.all([
        RNFetchBlob.fs.exists(FSPaths.issue(localIssueId)),
        RNFetchBlob.fs.exists(FSPaths.mediaRoot(localIssueId)),
    ])).every(_ => _)

/*
Cheeky size helper
*/
export const displayPerc = (elapsed: number, total: number) => {
    return `${Math.ceil((elapsed / total) * 100)}%`
}

export const displayFileSize = (size: File['size']): string => {
    if (!size) size = -1
    if (size / 1024 < 1) {
        return size.toFixed(2) + ' B'
    }
    if (size / 1024 / 1024 < 1) {
        return (size / 1024).toFixed(2) + ' KB'
    }
    return (size / 1024 / 1024).toFixed(2) + ' MB'
}

// TODO: have better types here!
export type DLStatus =
    | { type: 'download'; data: number }
    | { type: 'unzip'; data: 'start' }
    | { type: 'success' }
    | { type: 'failure' }

const deleteIssue = (localId: string): Promise<void> => {
    const promise = RNFetchBlob.fs
        .unlink(FSPaths.issue(localId))
        .catch(e => errorService.captureException(e))
    promise.then(() => localIssueListStore.remove(localId))
    return promise
}

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
            pushTracking('noAssets', 'complete')
            return
        }

        pushTracking(
            'attemptDataDownload',
            JSON.stringify({ localId, assets: assets.data }),
        )

        const issueDataDownload = await downloadNamedIssueArchive(
            localId,
            assets.data,
        ) // just the issue json

        const dataRes = await issueDataDownload.promise

        pushTracking('attemptDataDownload', 'completed')

        pushTracking(
            'attemptMediaDownload',
            JSON.stringify({ localId, assets: assets[imageSize] }),
        )

        const imgDL = await downloadNamedIssueArchive(localId, assets[
            imageSize
        ] as string) // just the images

        imgDL.progress((received, total) => {
            if (total >= received) {
                // the progress is only driven by the image download which will always
                // take the longest amount of time
                const num = (received / total) * 100
                updateListeners(localId, {
                    type: 'download',
                    data: num,
                })
            }
        })

        const imgRes = await imgDL.promise

        pushTracking('attemptMediaDownload', 'completed')

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

            pushTracking('unzipData', 'start')
            await unzipNamedIssueArchive(dataRes.path())
            pushTracking('unzipData', 'end')
            /**
             * The last thing we do is unzip the directory that will confirm if the issue exists
             */
            pushTracking('unzipImages', 'start')
            await unzipNamedIssueArchive(imgRes.path())
            pushTracking('unzipImages', 'end')
        } catch (error) {
            updateListeners(localId, { type: 'failure', data: error })
            pushTracking('unzipError', JSON.stringify(error))
            console.log('Unzip error: ', error)
        }

        pushTracking('downloadAndUnzip', 'complete')
        updateListeners(localId, { type: 'success' }) // null is unstarted or end
    } catch (error) {
        pushTracking('downloadAndUnzipError', JSON.stringify(error))
        updateListeners(localId, { type: 'failure', data: error })
        console.log('Download error: ', error)
    }
}

// This caches downloads so that if there is one already running you
// will get a reference to that rather promise than triggering a new one
export const downloadAndUnzipIssue = (
    issue: IssueSummary,
    imageSize: ImageSize,
    onProgress: (status: DLStatus) => void = () => {},
    run = runDownload,
) => {
    const { localId } = issue
    const promise = maybeListenToExistingDownload(issue, onProgress)
    if (promise) return promise

    const createDownloadPromise = async () => {
        try {
            pushTracking('attemptDownload', JSON.stringify(issue))
            await run(issue, imageSize)
            localIssueListStore.add(localId)
        } finally {
            pushTracking('completeAndDeleteCache', 'completed')
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

const withPathPrefix = (prefix: string) => (str: string) => `${prefix}/${str}`

export const getLocalIssues = () =>
    RNFetchBlob.fs
        .ls(FSPaths.contentPrefixDir)
        .then(files => files.map(withPathPrefix(defaultSettings.contentPrefix)))

export const clearOldIssues = async (): Promise<void> => {
    const files = await getLocalIssues()

    const issuesToDelete = files.filter(
        issue =>
            !lastSevenDays()
                .map(withPathPrefix(defaultSettings.contentPrefix))
                .includes(issue) && issue !== 'issues',
    )

    return Promise.all(issuesToDelete.map(issue => deleteIssue(issue)))
        .then(() =>
            sendComponentEvent({
                componentType: ComponentType.appVideo,
                action: Action.view,
                value: 'completed',
                componentId: 'clearOldIssues',
            }),
        )
        .catch(e => errorService.captureException(e))
}

export const matchSummmaryToKey = (
    issueSummaries: IssueSummary[],
    key: string,
): IssueSummary => {
    const summaryMatch = issueSummaries.find(
        issueSummary => issueSummary.key === key,
    ) as IssueSummary
    return summaryMatch || null
}

export const downloadTodaysIssue = async () => {
    const todaysKey = todayAsKey()
    try {
        const issueSummaries = await getIssueSummary()

        // Find the todays issue summary from the list of summary
        const todaysIssueSummary = matchSummmaryToKey(issueSummaries, todaysKey)

        // If there isnt one for today, then fahgettaboudit...
        if (!todaysIssueSummary) return null

        const isTodaysIssueOnDevice = await isIssueOnDevice(
            todaysIssueSummary.localId,
        )

        // Only download it if its not on the device
        if (!isTodaysIssueOnDevice) {
            const imageSize = await imageForScreenSize()
            downloadAndUnzipIssue(todaysIssueSummary, imageSize)
        }
    } catch (e) {
        console.log(`Unable to download todays issue: ${e.message}`)
    }
}

export const readIssueSummary = async () =>
    RNFetchBlob.fs
        .readFile(FSPaths.contentPrefixDir + defaultSettings.issuesPath, 'utf8')
        .then(data => JSON.parse(data))
        .catch(e => {
            throw e
        })

export const fetchAndStoreIssueSummary = async () => {
    const apiUrl = await getSetting('apiUrl')
    return RNFetchBlob.config({
        overwrite: true,
        path: FSPaths.contentPrefixDir + defaultSettings.issuesPath,
    })
        .fetch('GET', apiUrl + 'issues', {
            'Content-Type': 'application/json',
        })
        .then(async res => {
            return res.json()
        })
        .catch(e => {
            throw e
        })
}

const cleanFileDisplay = (stat: {
    path: string
    lastModified: string
    type: string
}) => ({
    path: stat.path.replace(FSPaths.issuesDir, ''),
    lastModified: londonTime(Number(stat.lastModified)).format(),
    type: stat.type,
})

export const getFileList = async () => {
    const files = await RNFetchBlob.fs.lstat(
        FSPaths.issuesDir + '/daily-edition',
    )

    const subfolders = await Promise.all(
        files.map(file =>
            file.type === 'directory'
                ? RNFetchBlob.fs.lstat(file.path).then(filestat => ({
                      [file.filename]: filestat.map(deepfile =>
                          cleanFileDisplay(deepfile),
                      ),
                  }))
                : {},
        ),
    )

    const cleanSubfolders = subfolders.filter(
        value => Object.keys(value).length !== 0,
    )

    const issuesFile = await RNFetchBlob.fs.stat(
        FSPaths.issuesDir + '/daily-edition/issues',
    )

    const cleanIssuesFile = [
        {
            issues: cleanFileDisplay(issuesFile),
        },
    ]

    return [...cleanSubfolders, ...cleanIssuesFile]
}
