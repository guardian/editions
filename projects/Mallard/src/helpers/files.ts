import RNFetchBlob from 'rn-fetch-blob'
import { unzip } from 'react-native-zip-archive'
import { Issue } from 'src/common'
import { FSPaths } from 'src/paths'
import { ImageSize } from '../../../common/src'
import { defaultSettings } from './settings/defaults';

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

/*
We always try to prep the file system before accessing issuesDir
*/
export const prepFileSystem = (): Promise<void> =>
    RNFetchBlob.fs.mkdir(FSPaths.issuesDir).catch(() => Promise.resolve())

export const getIssueFiles = async () => {
    await prepFileSystem()
    return RNFetchBlob.fs.ls(FSPaths.issuesDir)
}
export const deleteIssueFiles = async (): Promise<void> => {
    await RNFetchBlob.fs.unlink(FSPaths.issuesDir)
    await prepFileSystem()
}

const fileName = (path: string) => {
    const sections = path.split('/')
    return sections[sections.length - 1]
}

/*
Very low effort-ly optimise file list rebuilds.
Only regenerate the file object if we've got new files.

By using this in vanilla JS we don't have to fire up
react in the background
*/
let fileListRawMemo = ''
let fileListMemo: File[] = []

export const getJson = (path: string) =>
    RNFetchBlob.fs.readFile(path, 'utf8').then(d => JSON.parse(d))

const pathToFile = (basePath: string = '') => async (
    filePath: string,
): Promise<File> => {
    const path = basePath + '/' + filePath
    const { size: fsSize, type: fsType } = await RNFetchBlob.fs.stat(path)

    const type =
        fsType === 'directory'
            ? 'issue'
            : filePath.includes('.zip')
            ? 'archive'
            : filePath.includes('.json')
            ? 'json'
            : 'other'

    const id = filePath.split('.')[0]
    const size = parseInt(fsSize)

    if (type === 'issue') {
        const id = fileName(path)
        try {
            const issue = await getJson(FSPaths.issue(id))
            return {
                filename: filePath,
                path,
                id,
                size,
                type,
                issue,
            }
        } catch (e) {
            return {
                filename: filePath,
                path,
                id,
                size,
                type: 'other',
            }
        }
    }

    return {
        filename: filePath,
        path,
        id,
        size,
        type,
    }
}

export const getFileList = async (): Promise<File[]> => {
    const fileListRaw = await getIssueFiles()
    if (fileListRawMemo === fileListRaw.join()) {
        return fileListMemo
    } else {
        const fileList = await getIssueFiles().then(files =>
            Promise.all(files.map(pathToFile(FSPaths.issuesDir))),
        )
        fileListRawMemo = fileListRaw.join()
        fileListMemo = fileList
        return fileList
    }
}

/*
This cleans up all files & folders that we can't recognize as valid issues or zip files
*/
export const deleteOtherFiles = async (): Promise<void> => {
    const others = (await getFileList()).filter(({ type }) => type === 'other')
    return Promise.all(
        others.map(({ path }) => RNFetchBlob.fs.unlink(path)),
    ).then(Promise.resolve)
}

export const downloadIssue = (issue: File['id']) => {
    const zipUrl = defaultSettings.zipUrl
    const returnable = RNFetchBlob.config({
        fileCache: true,
        overwrite: true,
        IOSBackgroundTask: true,
    }).fetch('GET', `${zipUrl}${issue}.zip`)

    return {
        promise: returnable.then(async res => {
            await prepFileSystem()
            await RNFetchBlob.fs.mv(res.path(), FSPaths.issueZip(issue))
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

const CACHED_FOLDER_NAME = 'cached'

const moveSizedMediaDirToGenericMediaDir = async (issueId: string) => {
    const [sizedMediaDir] = (await RNFetchBlob.fs.ls(
        FSPaths.mediaRoot(issueId),
    )).filter(folder => folder !== CACHED_FOLDER_NAME) // find the first folder that isn't cached

    if (!sizedMediaDir) return

    const absSizedMediaDir = `${FSPaths.mediaRoot(issueId)}/${sizedMediaDir}`
    const genericMediaDir = `${FSPaths.mediaRoot(
        issueId,
    )}/${CACHED_FOLDER_NAME}`

    // if the file exists already, delete it and then replace it
    // unlink doesn't throw if it did not exist so we can call it without a check
    await RNFetchBlob.fs.unlink(genericMediaDir)

    RNFetchBlob.fs.mv(absSizedMediaDir, genericMediaDir)
}

const getIssueKey = (issueId: string, imageSize?: ImageSize) =>
    imageSize ? `${issueId}-${imageSize}` : issueId

export const unzipIssue = (issueId: string, imageSize?: ImageSize) => {
    const zipFilePath = FSPaths.issueZip(getIssueKey(issueId, imageSize))
    const outputPath = FSPaths.issuesDir

    return unzip(zipFilePath, outputPath).then(async () => {
        if (!!imageSize) {
            await moveSizedMediaDirToGenericMediaDir(issueId)
        }
        RNFetchBlob.fs.unlink(zipFilePath)
    })
}

export const isIssueOnDevice = async (issue: Issue['key']): Promise<boolean> =>
    (await getFileList()).find(file => {
        return fileIsIssue(file) && file.issue.key === issue
    }) !== undefined

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
    issueId: string,
    imageSize: ImageSize,
    onProgress: (status: DLStatus) => void = () => {},
) => {
    console.log(issueId)
    const dl = downloadIssue(issueId) // just the issue json

    dl.progress((received, total) => {
        console.log(received, total)
        if (total >= received) {
            // the progress of the first 10% is driven by the issue
            const num = (received / total) * 10
            onProgress({
                type: 'download',
                data: num,
            })
        }
    })

    return dl.promise
        .then(async () => {
            // might not need to await this but it's pretty quick
            await unzipIssue(issueId)

            const imgDL = downloadIssue(`${issueId}-${imageSize}`) // just the images

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
                unzipIssue(issueId, imageSize)
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
