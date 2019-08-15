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

    console.log(fsType)

    const type =
        fsType === 'directory'
            ? 'issue'
            : filePath.includes('.zip')
            ? 'archive'
            : filePath.includes('.json')
            ? 'json'
            : 'other'

            console.log(type)
    

    const id = filePath.split('.')[0]
    const size = parseInt(fsSize)

    if (type === 'issue') {
        const id = fileName(path)
        try {
            const issue = await getJson(path)
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
    // TODO: Needs to come from settings
    const zipUrl = 'https://editions-store.s3-eu-west-1.amazonaws.com/zips/'
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

export const unzipIssue = (issue: File['id']) => {
    const zipFilePath = FSPaths.issueZip(issue)
    const outputPath = FSPaths.issue()
    return unzip(zipFilePath, outputPath).then(() =>
        RNFetchBlob.fs.unlink(zipFilePath),
    )
}

export const isIssueOnDevice = async (issue: Issue['key']): Promise<boolean> =>
    (await getFileList()).find(
        file => {
            console.log(file)
            console.log(fileIsIssue(file))
            return fileIsIssue(file) && file.issue.key === issue
        },
    ) !== undefined

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

export const downloadAndUnzipIssue = (issueKey: string) => {
    const dl = downloadIssue(issueKey)

    dl.progress((received, total) => {
        if (total >= received) {
            const num = (received / total) * 100
            console.log(`${parseFloat(String(num)).toFixed(2)}%`)
        }
    })

    return dl.promise
        .then(async () => {
            return unzipIssue(issueKey).catch(error => {
                console.log('Unzip error: ', error)
            })
        })
        .catch(errorMessage => {
            console.log('Download error: ', errorMessage)
        })
}
