import { useState, useEffect } from 'react'
import RNFetchBlob from 'rn-fetch-blob'

export const issuesDir = `${RNFetchBlob.fs.dirs.DocumentDir}/issues`

export type File = {
    name: string
    path: string
    size: number
    type: 'other' | 'archive' | 'issue'
}

/*
 TODO: for now it's cool to fail this silently, BUT it means that either folder exists already (yay! we want that) or that something far more broken is broken (no thats bad)
 */
export const makeCacheFolder = (): Promise<void> =>
    RNFetchBlob.fs.mkdir(issuesDir).catch(() => Promise.resolve())

export const rebuildCacheFolder = async (): Promise<void> => {
    await RNFetchBlob.fs.unlink(issuesDir)
    await makeCacheFolder()
}

export const displayFileSize = (size: File['size']): string => {
    if (size / 1000 < 1) {
        return size + 'B'
    }
    if (size / 1000 / 1000 < 1) {
        return size / 1000 + 'KB'
    }
    return size / 1000 / 1000 + 'MB'
}

/*
 TODO: this code is uggers
 */
const makeFile = async (name: string): Promise<File> => {
    const path = issuesDir + '/' + name
    const { size, type } = await RNFetchBlob.fs.stat(path)
    return {
        name,
        size: parseInt(size),
        path,
        type:
            type === 'directory'
                ? 'issue'
                : name.includes('.zip')
                ? 'archive'
                : 'other',
    }
}

export const useFileList = (): [File[], () => void] => {
    const [files, setFiles] = useState<File[]>([])
    const refreshIssues = () => {
        RNFetchBlob.fs
            .ls(issuesDir)
            .then(files => Promise.all(files.map(makeFile)))
            .then(setFiles)
    }
    useEffect(() => {
        refreshIssues()
    }, [])

    return [files, refreshIssues]
}
