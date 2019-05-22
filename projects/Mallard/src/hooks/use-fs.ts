import { useState, useEffect } from 'react'
import RNFetchBlob from 'rn-fetch-blob'
import { issuesDir, File } from '../helpers/files'

type FileList = File[]

type FileListHook = [
    FileList,
    {
        refreshIssues: () => void
    }
]

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

const useFileList = (): FileListHook => {
    const [files, setFiles] = useState<FileList>([])
    const refreshIssues = () => {
        RNFetchBlob.fs
            .ls(issuesDir)
            .then(files => Promise.all(files.map(makeFile)))
            .then(setFiles)
    }
    useEffect(() => {
        refreshIssues()
    }, [])

    return [files, { refreshIssues }]
}

export { useFileList }
