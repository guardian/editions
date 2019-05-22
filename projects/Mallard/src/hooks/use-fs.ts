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
    if (size / 1024 < 1) {
        return size.toFixed(2) + ' B'
    }
    if (size / 1024 / 1024 < 1) {
        return (size / 1024).toFixed(2) + ' KB'
    }
    return (size / 1024 / 1024).toFixed(2) + ' MB'
}

/*
 TODO: this code can  more cleanly identify an unpacked issue vs an other 
 by reading a manifest inside of it & doing some basic file checking to verify integrity.

 We probably don't need to run useFileList outside of views meant 
 to manage files so it can be a bit expensive to call. We might
 not even need it in the final app!
 For actually consuming files when reading issues we might 
 wanna use a cheaper function and if 
 reading anything in an issue fails we can invalidate the whole thing and kick 
 off a fresh download in the background
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
