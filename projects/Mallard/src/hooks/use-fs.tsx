import React, { useContext, createContext } from 'react'
import { useState, useEffect } from 'react'
import { File, getFileList, downloadIssue } from '../helpers/files'

/*
Downloads
*/
interface DownloadQueueItem {
    received: number
    total: number
    cancel: () => void
}

interface DownloadQueue {
    [key: string]: DownloadQueueItem
}

type DownloadQueueHook = [
    DownloadQueue,
    (issue: File['issue']) => Promise<void>
]

const useDownloadQueueInCtx = (): DownloadQueueHook => {
    const [queue, setQueue] = useState<DownloadQueue>({})
    const deleteIssue = (issue: File['issue']) =>
        setQueue(q => {
            const clone = { ...q }
            delete clone[issue]
            return clone
        })
    const setIssue = (
        issue: File['issue'],
        state: Partial<DownloadQueueItem>,
    ) =>
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
            if (total >= received) {
                setIssue(issue, {
                    total,
                })
            }
            setIssue(issue, {
                received,
            })
        })
        setIssue(issue, {
            received: 0,
            total: -1,
            cancel: async () => {
                await dl.cancel()
                deleteIssue(issue)
            },
        })
        return dl.promise.then(() => {
            deleteIssue(issue)
        })
    }

    return [queue, download]
}

/*
Files
*/
type FileListHook = [
    File[],
    {
        refreshIssues: () => void
    }
]
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

/*
Provider
*/
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
