import { unzip } from 'react-native-zip-archive'
import RNFetchBlob from 'rn-fetch-blob'
import { Issue } from 'src/common'
import { FSPaths, MEDIA_CACHE_DIRECTORY_NAME } from 'src/paths'
import { ImageSize, IssueSummary } from '../../../common/src'
import { lastSevenDays, todayAsFolder } from './issues'
import { defaultSettings } from './settings/defaults'
import { imageForScreenSize } from './screen'
import { getIssueSummary } from 'src/hooks/use-api'

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

const fileName = (path: string) => {
    const sections = path.split('/')
    return sections[sections.length - 1]
}

export const getJson = (path: string) =>
    RNFetchBlob.fs.readFile(path, 'utf8').then(d => JSON.parse(d))

export const downloadNamedIssueArchive = (
    localIssueId: Issue['localId'],
    assetPath: string,
    filename: string,
) => {
    const zipUrl = defaultSettings.zipUrl
    const returnable = RNFetchBlob.config({
        fileCache: true,
        overwrite: true,
        IOSBackgroundTask: true,
    }).fetch('GET', `${zipUrl}/${assetPath}`)
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

/**
 * the api returns zips with folders that are named after the size of the device
 * we're on such as `/issue/12-12-12/media/tabletXL/media...`
 *
 * In future, if we add new breakpoints, this cache will be invisible if we're looking
 * for images using our new device name such as `tabletM`.
 *
 * This will move all images into a folder `/issue/12-12-12/media/cached/media...`
 */

const moveSizedMediaDirToGenericMediaDir = async (issueId: string) => {
    const [sizedMediaDir] = (await RNFetchBlob.fs.ls(
        FSPaths.mediaRoot(issueId),
    )).filter(folder => folder !== MEDIA_CACHE_DIRECTORY_NAME) // find the first folder that isn't cached

    if (!sizedMediaDir) return

    const absSizedMediaDir = `${FSPaths.mediaRoot(issueId)}/${sizedMediaDir}`
    const genericMediaDir = `${FSPaths.mediaRoot(
        issueId,
    )}/${MEDIA_CACHE_DIRECTORY_NAME}`

    // if the file exists already, delete it and then replace it
    const fileExists = await RNFetchBlob.fs.exists(genericMediaDir)
    if (fileExists) {
        await RNFetchBlob.fs.unlink(genericMediaDir)
    }

    RNFetchBlob.fs.mv(absSizedMediaDir, genericMediaDir)
}

export const unzipNamedIssueArchive = (
    localIssueId: Issue['localId'],
    filename: string,
) => {
    const zipFilePath = FSPaths.zip(localIssueId, filename)
    const outputPath = FSPaths.issuesDir

    return unzip(zipFilePath, outputPath).then(async () => {
        if (filename !== 'data') {
            await moveSizedMediaDirToGenericMediaDir(localIssueId)
        }
        RNFetchBlob.fs.unlink(zipFilePath)
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

export const downloadAndUnzipIssue = (
    issue: IssueSummary,
    imageSize: ImageSize,
    onProgress: (status: DLStatus) => void = () => {},
) => {
    const { assets, localId } = issue
    if (!assets) {
        return null
    }

    const issueDataDownload = downloadNamedIssueArchive(
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

            const imgDL = downloadNamedIssueArchive(
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
                unzipNamedIssueArchive(localId, imageSize)
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

export const clearOldIssues = async () => {
    const edition = 'daily-edition'
    const files = await RNFetchBlob.fs.ls(`${FSPaths.issuesDir}/${edition}`)

    const issuesToDelete = files.filter(
        issue => !lastSevenDays().includes(issue),
    )
    issuesToDelete.map(issue => RNFetchBlob.fs.unlink(FSPaths.issueRoot(issue)))
}

export const matchSummmaryToKey = (
    issueSummaries: IssueSummary[],
    key: string,
): IssueSummary => {
    const summaryMatch = issueSummaries.find(
        issueSummary =>
            issueSummary.localId === `${defaultSettings.appPrefix}/${key}`,
    ) as IssueSummary
    return summaryMatch || null
}

export const downloadTodaysIssue = async () => {
    const todaysKey = todayAsFolder()
    const issueSummaries = await getIssueSummary().getValue()
    // Find the todays issue summary from the list of summary
    const todaysIssueSummary = matchSummmaryToKey(issueSummaries, todaysKey)

    // If there isnt one for today, then fahgettaboudit...
    if (!todaysIssueSummary) return null

    const isTodaysIssueOnDevice = await isIssueOnDevice(
        todaysIssueSummary.localId,
    )

    // Only download it if its not on the device
    if (!isTodaysIssueOnDevice) {
        downloadAndUnzipIssue(todaysIssueSummary, imageForScreenSize())
    }
}
