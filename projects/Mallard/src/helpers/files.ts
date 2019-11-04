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
    await prepFileSystem()
}

export const getJson = <T extends any>(path: string): Promise<T> =>
    RNFetchBlob.fs.readFile(path, 'utf8').then(d => JSON.parse(d))

export const downloadNamedIssueArchive = async (
    localIssueId: Issue['localId'],
    assetPath: string,
    filename: string,
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
            await RNFetchBlob.fs.mv(
                res.path(),
                FSPaths.zip(localIssueId, filename),
            )
            return res
        }),
        cancel: returnable.cancel,
        progress: returnable.progress,
    }
}

export const unzipNamedIssueArchive = (
    localIssueId: Issue['localId'],
    filename: string,
) => {
    const zipFilePath = FSPaths.zip(localIssueId, filename)
    const outputPath = FSPaths.issuesDir

    return unzip(zipFilePath, outputPath).then(() => {
        return RNFetchBlob.fs.unlink(zipFilePath)
    })
}

export const isIssueOnDevice = async (
    localIssueId: Issue['localId'],
): Promise<boolean> => RNFetchBlob.fs.exists(FSPaths.issue(localIssueId))

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

export const downloadAndUnzipIssue = async (
    issue: IssueSummary,
    imageSize: ImageSize,
    onProgress: (status: DLStatus) => void = () => {},
) => {
    const { assets, localId } = issue
    if (!assets) {
        return null
    }

    const issueDataDownload = await downloadNamedIssueArchive(
        localId,
        assets.data,
        'data',
    ) // just the issue json

    issueDataDownload.progress((received, total) => {
        if (total >= received) {
            // the progress of the first 10% is driven by the issue
            const num = (received / total) * 10
            onProgress({
                type: 'download',
                data: num,
            })
        }
    })

    return issueDataDownload.promise
        .then(async () => {
            // might not need to await this but it's pretty quick
            await unzipNamedIssueArchive(localId, 'data')

            const imgDL = await downloadNamedIssueArchive(
                localId,
                assets[imageSize] as string,
                imageSize,
            ) // just the images

            imgDL.progress((received, total) => {
                if (total >= received) {
                    // the progress of the last 90% is driven by the images
                    const num = 10 + (received / total) * 90
                    onProgress({
                        type: 'download',
                        data: num,
                    })
                }
            })

            return imgDL.promise.then(() => {
                onProgress({
                    type: 'unzip',
                    data: 'start',
                })
                return unzipNamedIssueArchive(localId, imageSize)
                    .then(() => {
                        onProgress({ type: 'success' }) // null is unstarted or end
                    })
                    .catch(error => {
                        onProgress({ type: 'failure', data: error })
                        console.log('Unzip error: ', error)
                    })
            })
        })
        .catch(error => {
            onProgress({ type: 'failure', data: error })
            console.log('Download error: ', error)
        })
}

const deleteIssue = (issue: string): Promise<void> =>
    RNFetchBlob.fs
        .unlink(`${FSPaths.contentPrefixDir}/${issue}`)
        .catch(e => errorService.captureException(e))

export const clearOldIssues = async (): Promise<void> => {
    const files = await RNFetchBlob.fs.ls(FSPaths.contentPrefixDir)

    const issuesToDelete = files.filter(
        issue => !lastSevenDays().includes(issue) && issue !== 'issues',
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
