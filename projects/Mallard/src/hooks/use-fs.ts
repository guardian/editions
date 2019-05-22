import { useState, useEffect } from 'react'
import { File, getFileList } from '../helpers/files'

type FileListHook = [
    File[],
    {
        refreshIssues: () => void
    }
]

const useFileList = (): FileListHook => {
    const [files, setFiles] = useState<File[]>([])

    const refreshIssues = () => {
        getFileList().then(setFiles)
    }
    useEffect(() => {
        refreshIssues()
    }, [])

    return [files, { refreshIssues }]
}

export { useFileList }
