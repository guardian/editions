import { useState, useEffect } from 'react'
import { File, getFileList, downloadIssue } from 'src/helpers/files'
import { createMixedProviderHook__SLOW } from 'src/helpers/provider'

/*
Downloads
*/
interface DownloadQueueItem {
    received: number
    total: number
    cancel: () => void
}

export interface DownloadQueue {
    [key: string]: DownloadQueueItem
}

type DownloadQueueHook = [DownloadQueue, (issue: File['id']) => Promise<void>]

const useDownloadQueueInCtx = (): DownloadQueueHook => {
    const [queue, setQueue] = useState<DownloadQueue>({})
    const deleteIssue = (issue: File['id']) =>
        setQueue(q => {
            const clone = { ...q }
            delete clone[issue]
            return clone
        })
    const setIssue = (issue: File['id'], state: Partial<DownloadQueueItem>) =>
        setQueue(q => ({
            ...q,
            [issue]: {
                ...q[issue],
                ...state,
            },
        }))
    const download = (issue: File['id']) => {
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
    },
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
const {
    Provider: FileSystemProvider,
    useAsHook,
} = createMixedProviderHook__SLOW<{
    fileList: FileListHook
    downloads: DownloadQueueHook
}>(() => {
    const fileList = useFileListInCtx()
    const downloads = useDownloadQueueInCtx()

    if (fileList !== null && downloads !== null) return { fileList, downloads }
    return null
})

const useFileList = (): FileListHook => useAsHook().fileList
const useDownloadQueue = (): DownloadQueueHook => useAsHook().downloads

export { FileSystemProvider, useFileList, useDownloadQueue }
