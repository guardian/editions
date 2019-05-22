import RNFetchBlob from 'rn-fetch-blob'
import { unzip } from 'react-native-zip-archive'

export const issuesDir = `${RNFetchBlob.fs.dirs.DocumentDir}/issues`

export type File = {
    filename: string
    path: string
    size: number
    issue: string
    type: 'other' | 'archive' | 'issue'
}

/*
 TODO: for now it's cool to fail this silently, BUT it means that either folder exists already (yay! we want that) or that something far more broken is broken (no thats bad)
 */
export const makeCacheFolder = (): Promise<void> =>
    RNFetchBlob.fs.mkdir(issuesDir).catch(() => Promise.resolve())

/*
This cleans EVERYTHING
*/
export const deleteAllFiles = async (): Promise<void> => {
    await RNFetchBlob.fs.unlink(issuesDir)
    await makeCacheFolder()
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
export const downloadIssue = (issue: File['issue']) => {
    const returnable = RNFetchBlob.config({
        fileCache: true,
        overwrite: true,
    }).fetch(
        'GET',
        `https://github.com/guardian/dotcom-rendering/archive/master.zip?issue=${issue}date=${Date.now()}`,
    )

    return {
        promise: returnable.then(async res => {
            await makeCacheFolder()
            await RNFetchBlob.fs.mv(
                res.path(),
                `${issuesDir}/test-${Date.now()}.zip`,
            )
            return res
        }),
        progress: returnable.progress,
    }
}

export const unzipIssue = (issue: File['issue']) => {
    const zipFilePath = issuesDir + '/' + issue + '.zip'
    const outputPath = issuesDir + '/' + issue
    return unzip(zipFilePath, outputPath).then(() =>
        RNFetchBlob.fs.unlink(zipFilePath),
    )
}

/*
Cheeky size helper
*/
export const displayFileSize = (size: File['size']): string => {
    if (size / 1024 < 1) {
        return size.toFixed(2) + ' B'
    }
    if (size / 1024 / 1024 < 1) {
        return (size / 1024).toFixed(2) + ' KB'
    }
    return (size / 1024 / 1024).toFixed(2) + ' MB'
}

/*
Very low effort-ly optimise file list rebuilds. 
Only regenerate the file object if we've got new files.

By using this in vanilla JS we don't have to fire up 
react in the background
*/
let fileListRawMemo: string = ''
let fileListMemo: File[] = []

const makeFile = async (filename: string): Promise<File> => {
    const path = issuesDir + '/' + filename
    const { size, type } = await RNFetchBlob.fs.stat(path)
    return {
        filename,
        issue: filename.split('.')[0],
        size: parseInt(size),
        path,
        type:
            type === 'directory'
                ? 'issue'
                : filename.includes('.zip')
                ? 'archive'
                : 'other',
    }
}

export const getFileList = async (): Promise<File[]> => {
    const fileListRaw = await RNFetchBlob.fs.ls(issuesDir)
    if (fileListRawMemo === fileListRaw.join()) {
        return fileListMemo
    } else {
        const fileList = await RNFetchBlob.fs
            .ls(issuesDir)
            .then(files => Promise.all(files.map(makeFile)))
        fileListRawMemo = fileListRaw.join()
        fileListMemo = fileList
        return fileList
    }
}
