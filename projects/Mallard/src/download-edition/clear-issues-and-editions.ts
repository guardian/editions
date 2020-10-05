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
import { getSelectedEditionSlug } from 'src/hooks/use-edition-provider'
import { editionsListCache } from 'src/helpers/storage'
import { getEditionIds } from '../../../Apps/common/src/helpers'
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

/**
 * Takes a list of directories and the current editions list and works out which directories
 * are safe to 'clean' - excluding those related to defaultRegionalEditions, hidden folders and
 * folders called 'download'
 * @param directoryList
 * @param editionList
 */
const editionDirsToClean = (
    directoryList: { name: string; path: string }[],
    editionList: EditionId[],
): { name: string; path: string }[] => {
    // we never want to delete default regional editions
    const editionsToKeep = editionList.concat(
        defaultRegionalEditions.map(e => e.edition),
    )
    // don't clean hidden folders, folders called 'download' or editions we want to keep
    return directoryList.filter(
        d =>
            !d.name.startsWith('.') &&
            d.name !== 'download' &&
            !editionsToKeep.includes(d.name),
    )
}

const getDirsToClean = async (path: string, editionList: EditionId[]) => {
    const directories = await RNFS.readDir(path)
    return editionDirsToClean(directories, editionList)
}

// deletes issue files in editon directories at <root>/
const deleteOldEditionIssues = async (editionIds: EditionId[]) => {
    const rootEditionFoldersToClean = await getDirsToClean(
        FSPaths.issuesDir,
        editionIds,
    )

    // we've had issues in the past with deleting issue folders, so just delete the issues for the edition
    const issuesToClear = await Promise.all(
        rootEditionFoldersToClean.map(e => getLocalIssues(e.name)),
    )
    issuesToClear.forEach(issues => {
        try {
            deleteIssues(issues, 'clearOldEditions')
        } catch (error) {
            errorService.captureException(error)
        }
    })
}

// deletes everything in the <root>/download/ directory
const cleanEditionsDownloadFolder = async (editionIds: EditionId[]) => {
    const downloadEditionFoldersToDelete = await getDirsToClean(
        FSPaths.downloadRoot,
        editionIds,
    )
    downloadEditionFoldersToDelete.forEach(f =>
        RNFS.unlink(f.path).catch(e => {
            errorService.captureException(e)
        }),
    )
}

const cleanOldEditions = async () => {
    const editionsList = await editionsListCache.get()
    const editionIds = editionsList ? getEditionIds(editionsList) : []
    // we don't care *that* much if we fail to delete old editions so just log any errors to sentry
    try {
        await deleteOldEditionIssues(editionIds)
        await cleanEditionsDownloadFolder(editionIds)
    } catch (error) {
        errorService.captureException(error)
    }
}

export {
    clearOldIssues,
    deleteIssueFiles,
    clearDownloadsDirectory,
    cleanOldEditions,
    editionDirsToClean,
}
