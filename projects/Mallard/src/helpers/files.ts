import RNFetchBlob from 'rn-fetch-blob'
import { unzip } from 'react-native-zip-archive'
import { Issue } from 'src/common'
import { FSPaths } from 'src/paths'

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
 TODO: for now it's cool to fail this silently, BUT it means that either folder exists already (yay! we want that) or that something far more broken is broken (no thats bad)
 */
export const makeCacheFolder = (): Promise<void> =>
    RNFetchBlob.fs.mkdir(FSPaths.issuesDir).catch(() => Promise.resolve())

/*
This cleans EVERYTHING
*/
export const deleteAllFiles = async (): Promise<void> => {
    await RNFetchBlob.fs.unlink(FSPaths.issuesDir)
    await makeCacheFolder()
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
    RNFetchBlob.fs.readFile(path, 'utf8').then(d => {
        return JSON.parse(d)
    })

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
        } catch {
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
    const fileListRaw = await RNFetchBlob.fs.ls(FSPaths.issuesDir)
    if (fileListRawMemo === fileListRaw.join()) {
        return fileListMemo
    } else {
        const fileList = await RNFetchBlob.fs
            .ls(FSPaths.issuesDir)
            .then(files =>
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

/*
TODO: this is not the real issue url
*/
export const downloadIssue = (issue: File['id']) => {
    const returnable = RNFetchBlob.config({
        fileCache: true,
        overwrite: true,
    }).fetch(
        'GET',
        `https://lauras-funhouse.s3.amazonaws.com/demo-issue.zip?v=1560804690298?issue=${issue}date=${Date.now()}`,
    )

    return {
        promise: returnable.then(async res => {
            await makeCacheFolder()
            await RNFetchBlob.fs.mv(
                res.path(),
                FSPaths.issueZip(
                    `${Date.now()}-${Math.trunc(Math.random() * 100000)}`,
                ),
            )
            return res
        }),
        cancel: returnable.cancel,
        progress: returnable.progress,
    }
}

export const unzipIssue = (issue: File['id']) => {
    const zipFilePath = FSPaths.issueZip(issue)
    const outputPath = FSPaths.issue(issue)
    return unzip(zipFilePath, outputPath).then(() =>
        RNFetchBlob.fs.unlink(zipFilePath),
    )
}

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
