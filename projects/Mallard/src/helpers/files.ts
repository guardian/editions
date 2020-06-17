import { unzip } from 'react-native-zip-archive'
import RNFS from 'react-native-fs'
import { Issue } from 'src/common'
import { FSPaths } from 'src/paths'
import { IssueSummary } from '../../../Apps/common/src'
import { lastNDays } from './issues'
import { imageForScreenSize } from './screen'
import { getSetting } from './settings'
import { defaultSettings, editions } from './settings/defaults'
import { errorService } from 'src/services/errors'
import { londonTime } from './date'
import { withCache } from './fetch/cache'
import { crashlyticsService } from 'src/services/crashlytics'
import { updateListeners } from 'src/download-edition/download-and-unzip'

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
    RNFS.mkdir(dir).catch(() => Promise.resolve())

/*
We always try to prep the file system before accessing issuesDir
*/
export const prepFileSystem = async (): Promise<void> => {
    await ensureDirExists(FSPaths.issuesDir)
    await ensureDirExists(FSPaths.downloadRoot)
    await Promise.all(
        Object.values(editions).map(edition =>
            ensureDirExists(`${FSPaths.issuesDir}/${edition}`),
        ),
    )
}

export const getJson = <T extends any>(path: string): Promise<T> =>
    RNFS.readFile(path, 'utf8').then(d => JSON.parse(d))

export const downloadNamedIssueArchive = async ({
    localIssueId,
    assetPath,
    filename,
    withProgress,
}: {
    localIssueId: Issue['localId']
    assetPath: string
    filename: string
    withProgress: boolean
}) => {
    const apiUrl = await getSetting('apiUrl')
    const zipUrl = `${apiUrl}${assetPath}`
    const downloadFolderLocation = FSPaths.downloadIssueLocation(localIssueId)
    await prepFileSystem()
    await ensureDirExists(FSPaths.issueRoot(localIssueId))
    await ensureDirExists(downloadFolderLocation)

    try {
        const returnable = RNFS.downloadFile({
            fromUrl: zipUrl,
            toFile: `${downloadFolderLocation}/${filename}`,
            background: true,
            begin: () => console.log('start download'),
            progress: response => {
                if (withProgress) {
                    const percentage =
                        (response.bytesWritten / response.contentLength) * 100
                    updateListeners(localIssueId, {
                        type: 'download',
                        data: percentage,
                    })
                }
            },
            progressInterval: 1,
        }).promise
        return {
            promise: returnable.then(async res => {
                // Ensure issue is removed from the cache on completion
                const { clear } = withCache('issue')
                clear(localIssueId)
                return res
            }),
        }
    } catch (e) {
        e.message = `downloadNamedIssueArchive failed: ${e.message}`
        errorService.captureException(e)
        throw e
    }
}

export const unzipNamedIssueArchive = (zipFilePath: string) => {
    const outputPath = FSPaths.issuesDir

    return unzip(zipFilePath, outputPath)
        .then(() => {
            return RNFS.unlink(zipFilePath)
        })
        .catch(e => {
            e.message = `${e.message} - zipFilePath: ${zipFilePath} - outputPath: ${outputPath}`
            errorService.captureException(e)
            crashlyticsService.captureException(e)
        })
}

/**
 * Only return true if we have both directories
 */
export const isIssueOnDevice = async (
    localIssueId: Issue['localId'],
): Promise<boolean> =>
    (await Promise.all([
        RNFS.exists(FSPaths.issue(localIssueId)),
        RNFS.exists(FSPaths.mediaRoot(localIssueId)),
        RNFS.exists(`${FSPaths.issueRoot(localIssueId)}/front`),
        RNFS.exists(`${FSPaths.issueRoot(localIssueId)}/thumbs`),
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

const withPathPrefix = (prefix: string) => (str: string) => `${prefix}/${str}`

export const getLocalIssues = async () => {
    const editionDirectory = await FSPaths.editionDir()
    const edition = await getSetting('edition')
    return RNFS.readdir(editionDirectory).then(files =>
        files.map(withPathPrefix(edition)),
    )
}

export const issuesToDelete = async (files: string[]) => {
    const maxAvailableEditions = await getSetting('maxAvailableEditions')
    const edition = await getSetting('edition')
    const lastNumberOfDays = lastNDays(maxAvailableEditions)
    return files.filter(
        issue =>
            !lastNumberOfDays.map(withPathPrefix(edition)).includes(issue) &&
            issue !== `${edition}/issues`,
    )
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

export const readIssueSummary = async (): Promise<IssueSummary[]> => {
    const editionDirectory = await FSPaths.editionDir()
    return RNFS.readFile(editionDirectory + defaultSettings.issuesPath, 'utf8')
        .then(data => {
            try {
                return JSON.parse(data)
            } catch (e) {
                e.message = `readIssueSummary: ${e.message} - with: ${data}`
                console.log(e.message)
                errorService.captureException(e)
                crashlyticsService.captureException(e)
                throw e
            }
        })
        .catch(e => {
            throw e
        })
}

export const fetchAndStoreIssueSummary = async (): Promise<IssueSummary[]> => {
    const apiUrl = await getSetting('apiUrl')
    const edition = await getSetting('edition')
    const editionDirectory = await FSPaths.editionDir()

    const fetchIssueSummaryUrl = `${apiUrl}${edition}/issues`

    try {
        const issueSummaryRequest = await fetch(fetchIssueSummaryUrl)
        const issueSummary = await issueSummaryRequest.json()
        if (!issueSummary) {
            throw new Error('No Issume Summary Avaialble')
        }

        const issueSummaryString = JSON.stringify(issueSummary)
        await RNFS.writeFile(
            editionDirectory + defaultSettings.issuesPath,
            issueSummaryString,
            'utf8',
        )

        // The above saves it locally, if successful we return it
        return issueSummary
    } catch (e) {
        e.message = `Failed to fetch valid issue summary: ${e.message}`
        errorService.captureException(e)
        crashlyticsService.captureException(e)
        // Got a problem with the endpoint, return the last saved version
        return readIssueSummary()
    }
}

const cleanFileDisplay = (stat: RNFS.ReadDirItem | RNFS.StatResult) => ({
    path: stat.path.replace(FSPaths.issuesDir, ''),
    lastModified: londonTime(Number(stat.mtime)).format(),
    type: stat.isDirectory() ? 'directory' : 'file',
})

export const getFileList = async () => {
    const imageFolders: RNFS.ReadDirItem[] = []
    const editionDirectory = await FSPaths.editionDir()
    const files = await RNFS.readDir(editionDirectory)

    const subfolders = await Promise.all(
        files.map(file =>
            file.isDirectory()
                ? RNFS.readDir(file.path).then(filestat => ({
                      [file.name]: filestat.map(deepfile => {
                          if (
                              deepfile.name === 'media' ||
                              deepfile.name === 'thumbs'
                          ) {
                              imageFolders.push(deepfile)
                          }
                          return cleanFileDisplay(deepfile)
                      }),
                  }))
                : {},
        ),
    )

    const cleanSubfolders = subfolders.filter(
        value => Object.keys(value).length !== 0,
    )

    const imageSize = await imageForScreenSize()

    // Grab one images from each image folder to confirm successful unzip
    const imageFolderSearch = await Promise.all(
        imageFolders.map(async (file: RNFS.ReadDirItem) => {
            return await RNFS.readDir(
                file.name === 'media'
                    ? `${file.path}/${imageSize}/media`
                    : `${file.path}/${imageSize}/thumb/media`,
            ).then(filestat =>
                filestat
                    .map(deepfile => cleanFileDisplay(deepfile))
                    .slice(0, 1),
            )
        }),
    )

    const issuesFile = await RNFS.stat(editionDirectory + '/issues')

    const cleanIssuesFile = [
        {
            issues: cleanFileDisplay(issuesFile),
        },
    ]

    return [...cleanSubfolders, ...cleanIssuesFile, ...imageFolderSearch]
}
