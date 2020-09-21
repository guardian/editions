import RNFS from 'react-native-fs'
import { pushTracking, PushTrackingId } from 'src/notifications/push-tracking'
import { Feature } from '../../../Apps/common/src/logging'
import { errorService } from 'src/services/errors'
import { FSPaths } from 'src/paths'
import { localIssueListStore } from 'src/hooks/use-issue-on-device'
import {
    prepFileSystem,
    getLocalIssues,
    issuesToDelete,
} from 'src/helpers/files'
import {
    getSelectedEditionSlug,
    useEditions,
} from 'src/hooks/use-edition-provider'
import { editionsListCache } from 'src/helpers/storage'
import { allEditionIds } from '../../../Apps/common/src/helpers'
import { defaultRegionalEditions } from '../../../Apps/common/src/editions-defaults'
import { EditionId } from '../../../Apps/common/src'

const clearDownloadsDirectory = async () => {
    try {
        const files = await RNFS.readDir(FSPaths.downloadRoot)
        files.map(
            async (file: RNFS.ReadDirItem) =>
                await RNFS.unlink(file.path).catch(() => {
                    // Android says nothing exists here but they are empty folders, so this supresses the warning
                }),
        )
        await Promise.all(files)
        await prepFileSystem()
    } catch (error) {
        await pushTracking(
            'tempFileRemoveError',
            JSON.stringify(error),
            Feature.CLEAR_ISSUES,
        )
        console.log(`Error cleaning up download issues folder `, error)
        errorService.captureException(error)
    }
}

export const deleteIssue = async (localId: string): Promise<boolean> => {
    const issuePath = FSPaths.issueRoot(localId)
    const doesItExist = await RNFS.exists(issuePath)
    if (doesItExist) {
        await RNFS.unlink(issuePath).catch(e => {
            errorService.captureException(e)
        })
        localIssueListStore.remove(localId)
        return true
    }
    return false
}

const deleteIssueFiles = async (): Promise<void> => {
    await RNFS.unlink(FSPaths.issuesDir)
    localIssueListStore.reset()
    await prepFileSystem()
    await clearDownloadsDirectory()
}

const deleteIssues = (issuesToDelete: string[], trackingId: PushTrackingId) => {
    return Promise.all(
        issuesToDelete.map((issue: string) => deleteIssue(issue)),
    )
        .then(() => pushTracking(trackingId, 'completed', Feature.CLEAR_ISSUES))
        .catch(e => {
            errorService.captureException(e)
        })
}

const clearOldIssues = async (): Promise<void> => {
    const edition = await getSelectedEditionSlug()
    const files = await getLocalIssues(edition)

    const iTD: string[] = await issuesToDelete(files)
    return deleteIssues(iTD, 'clearOldIssues')
}

const editionDirsToClean = (
    directoryList: { name: string; path: string }[],
    editionList: EditionId[],
): { name: string; path: string }[] => {
    // we never want to delete default region editions
    const editionsToKeep = editionList.concat(
        defaultRegionalEditions.map(e => e.edition),
    )
    // don't clean hidden folders, the download folder or editions we want to keep
    return directoryList.filter(
        d =>
            !d.name.startsWith('.') &&
            d.name !== 'download' &&
            !editionsToKeep.includes(d.name),
    )
}

const deleteOldEditionIssues = async (editionIds: EditionId[]) => {
    const rootFolders = await RNFS.readDir(FSPaths.issuesDir)

    const rootEditionFoldersToClean = editionDirsToClean(
        rootFolders,
        editionIds,
    )

    // we've had issues in the past with deleting issue folders, so just delete the issues for the edition
    const issuesToClear = await Promise.all(
        rootEditionFoldersToClean.map(e => getLocalIssues(e.name)),
    )
    issuesToClear.forEach(issues => deleteIssues(issues, 'clearOldEditions'))
}

const cleanEditionsDownloadFolder = async (editionIds: EditionId[]) => {
    const downloadFolders = await RNFS.readDir(FSPaths.downloadRoot)
    const downloadEditionFoldersToDelete = editionDirsToClean(
        downloadFolders,
        editionIds,
    )
    // we don't care about download folders - delete them all!
    downloadEditionFoldersToDelete.forEach(f => RNFS.unlink(f.path))
}

const deleteOldEditions = async () => {
    const editionsList = await editionsListCache.get()
    const editionIds = editionsList ? allEditionIds(editionsList) : []
    await deleteOldEditionIssues(editionIds)
    await cleanEditionsDownloadFolder(editionIds)
}

export {
    clearOldIssues,
    deleteIssueFiles,
    clearDownloadsDirectory,
    deleteOldEditions,
    editionDirsToClean,
}
