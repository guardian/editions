import RNFetchBlob from 'rn-fetch-blob'

export const issuesDir = `${RNFetchBlob.fs.dirs.DocumentDir}/issues`

export type File = {
    name: string
    path: string
    size: number
    type: 'other' | 'archive' | 'issue'
}

export type IssueId = string

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
TODO: this is not the real issue id
*/
export const downloadIssue = (issue: IssueId) => {
    const returnable = RNFetchBlob.config({
        fileCache: true,
    }).fetch(
        'GET',
        `https://github.com/guardian/dotcom-rendering/archive/master.zip?issue=${issue}date=${Date.now()}`,
    )
    returnable.then(async res => {
        await makeCacheFolder()
        await RNFetchBlob.fs.mv(
            res.path(),
            `${issuesDir}/test-${Date.now()}.zip`,
        )
        return res
    })

    return {
        ...returnable,
        progress: returnable.progress,
    }
}
