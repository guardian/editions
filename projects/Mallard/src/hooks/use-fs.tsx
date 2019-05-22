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
    const deleteIssue = (issue: File['issue']) =>
        setQueue(q => {
            const clone = { ...q }
            delete clone[issue]
            return clone
        })
    const setIssue = (issue: File['issue'], state) =>
        setQueue(q => ({
            ...q,
            [issue]: {
                ...q[issue],
                ...state,
            },
        }))
    const download = (issue: File['issue']) => {
        const dl = downloadIssue(issue)
        dl.progress((received, total) => {
            setIssue(issue, {
                progress: received / total,
                cancel: async () => {
                    await dl.cancel()
                    setTimeout(() => {
                        deleteIssue(issue)
                    }, 1000)
                },
            })
        })
        setIssue(issue, {
            progress: 0,
            cancel: dl.cancel,
        })
        return dl.promise.then(() => {
            deleteIssue(issue)
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
