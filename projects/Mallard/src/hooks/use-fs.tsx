import React, { useContext, createContext } from 'react'
import { useState, useEffect } from 'react'
import { File, getFileList, downloadIssue } from '../helpers/files'

type FileListHook = [
    File[],
    {
        refreshIssues: () => void
    }
]

type DownloadQueue = {
    [key: string]: {
        progress: number
    }
}

type DownloadQueueHook = [
    DownloadQueue,
    (issue: File['issue']) => Promise<void>
]

const useDownloadQueueInCtx = (): DownloadQueueHook => {
    const [queue, setQueue] = useState({})

    const download = (issue: File['issue']) => {
        const dl = downloadIssue(issue)
        dl.progress((received, total) => {
            setQueue(q => ({
                ...q,
                [issue]: {
                    progress: received / total,
                },
            }))
        })
        setQueue(q => ({
            ...q,
            [issue]: {
                progress: 0,
            },
        }))
        return dl.promise.then(() => {
            setQueue(q => {
                delete q[issue]
                return q
            })
        })
    }

    return [queue, download]
}

const useFileListInCtx = (): FileListHook => {
    const [files, setFiles] = useState<File[]>([])

    const refreshIssues = () => {
        getFileList().then(setFiles)
    }
    useEffect(() => {
        refreshIssues()
    }, [])

    return [files, { refreshIssues }]
}

const FileSystemContext = createContext<{
    fileList: FileListHook
    downloads: DownloadQueueHook
}>({} as {
    fileList: FileListHook
    downloads: DownloadQueueHook
})

const FileSystemProvider = ({ children }: { children: React.ReactNode }) => (
    <FileSystemContext.Provider
        value={{
            fileList: useFileListInCtx(),
            downloads: useDownloadQueueInCtx(),
        }}
    >
        {children}
    </FileSystemContext.Provider>
)
const useFileList = (): FileListHook => useContext(FileSystemContext).fileList
const useDownloadQueue = (): DownloadQueueHook =>
    useContext(FileSystemContext).downloads

export { FileSystemProvider, useFileList, useDownloadQueue }
