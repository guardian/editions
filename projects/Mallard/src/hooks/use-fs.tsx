import React, { useContext, createContext } from 'react'
import { useState, useEffect } from 'react'
import { File, getFileList } from '../helpers/files'

type FileListHook = [
    File[],
    {
        refreshIssues: () => void
    }
]

const useFileListInCtx = (): FileListHook => {
    const [files, setFiles] = useState<File[]>([])
    console.log(files)

    const refreshIssues = () => {
        getFileList().then(setFiles)
    }
    useEffect(() => {
        refreshIssues()
    }, [])

    return [files, { refreshIssues }]
}

const SettingsContext = createContext<FileListHook>({} as FileListHook)

const FileSystemProvider = ({ children }: { children: React.ReactNode }) => (
    <SettingsContext.Provider value={useFileListInCtx()}>
        {children}
    </SettingsContext.Provider>
)
const useFileList = (): FileListHook => useContext(SettingsContext)

export { FileSystemProvider, useFileList }
