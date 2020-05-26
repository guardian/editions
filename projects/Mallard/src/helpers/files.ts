import { unzip } from 'react-native-zip-archive'
import RNFetchBlob, { RNFetchBlobStat } from 'rn-fetch-blob'
import { Issue } from 'src/common'
import { FSPaths } from 'src/paths'
import { IssueSummary } from '../../../Apps/common/src'
import { lastNDays } from './issues'
import { imageForScreenSize } from './screen'
import { getSetting } from './settings'
import { defaultSettings } from './settings/defaults'
import { errorService } from 'src/services/errors'
import { londonTime } from './date'
import { withCache } from './fetch/cache'

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
            // Ensure issue is removed from the cache on completion
            const { clear } = withCache('issue')
            clear(localIssueId)
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

    return unzip(zipFilePath, outputPath)
        .then(() => {
            return RNFetchBlob.fs.unlink(zipFilePath)
        })
        .catch(e => {
            e.message = `${e.message} - zipFilePath: ${zipFilePath} - outputPath: ${outputPath}`
            errorService.captureException(e)
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
        RNFetchBlob.fs.exists(`${FSPaths.issueRoot(localIssueId)}/front`),
        RNFetchBlob.fs.exists(`${FSPaths.issueRoot(localIssueId)}/thumbs`),
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

export const getLocalIssues = () =>
    RNFetchBlob.fs
        .ls(FSPaths.contentPrefixDir)
        .then(files => files.map(withPathPrefix(defaultSettings.contentPrefix)))

export const issuesToDelete = async (files: string[]) => {
    const maxAvailableEditions = await getSetting('maxAvailableEditions')
    const lastNumberOfDays = lastNDays(maxAvailableEditions)
    return files.filter(
        issue =>
            !lastNumberOfDays
                .map(withPathPrefix(defaultSettings.contentPrefix))
                .includes(issue) &&
            issue !== `${defaultSettings.contentPrefix}/issues`,
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

export const readIssueSummary = async (): Promise<IssueSummary[]> =>
    RNFetchBlob.fs
        .readFile(FSPaths.contentPrefixDir + defaultSettings.issuesPath, 'utf8')
        .then(data => {
            try {
                return JSON.parse(data)
            } catch (e) {
                e.message = `readIssueSummary: ${e.message} - with: ${data}`
                console.log(e.message)
                errorService.captureException(e)
                throw e
            }
        })
        .catch(e => {
            throw e
        })

export const fetchAndStoreIssueSummary = async (): Promise<IssueSummary[]> => {
    const apiUrl = await getSetting('apiUrl')
    const edition = await getSetting('edition')

    const fetchIssueSummaryUrl = `${apiUrl}${edition}/issues`

    try {
        await RNFetchBlob.config({
            overwrite: true,
            path: FSPaths.contentPrefixDir + defaultSettings.issuesPath,
            IOSBackgroundTask: true,
        }).fetch('GET', fetchIssueSummaryUrl, {
            'Content-Type': 'application/json',
        })

        // The above saves it locally, if successful we return it
        return await readIssueSummary()
    } catch (e) {
        e.message = `Failed to fetch valid issue summary: ${e.message}`
        errorService.captureException(e)
        // Got a problem with the endpoint, return the last saved version
        return readIssueSummary()
    }
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
    const imageFolders: RNFetchBlobStat[] = []
    const files = await RNFetchBlob.fs.lstat(
        FSPaths.issuesDir + '/daily-edition',
    )

    const subfolders = await Promise.all(
        files.map(file =>
            file.type === 'directory'
                ? RNFetchBlob.fs.lstat(file.path).then(filestat => ({
                      [file.filename]: filestat.map(deepfile => {
                          if (
                              deepfile.filename === 'media' ||
                              deepfile.filename === 'thumbs'
                          ) {
                              imageFolders.push(deepfile)
                          }
                          return cleanFileDisplay(deepfile)
                      }),
                  }))
                : {},
        ),
    )

    const imageSize = await imageForScreenSize()

    // Grab one images from each image folder to confirm successful unzip
    const imageFolderSearch = await Promise.all(
        imageFolders.map(async (file: RNFetchBlobStat) => {
            return await RNFetchBlob.fs
                .lstat(
                    file.filename === 'media'
                        ? `${file.path}/${imageSize}/media`
                        : `${file.path}/${imageSize}/thumb/media`,
                )
                .then(filestat =>
                    filestat
                        .map(deepfile => cleanFileDisplay(deepfile))
                        .slice(0, 1),
                )
        }),
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

    return [...cleanSubfolders, ...cleanIssuesFile, ...imageFolderSearch]
}
