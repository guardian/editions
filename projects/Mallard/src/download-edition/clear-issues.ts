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

// maybe this is unnecessary as James suggested we don't
// want to delete the folders as that might cause bugs
const deleteEditionDirectory = async (
    editionSlug: string,
): Promise<boolean> => {
    const editionPath = FSPaths.editionDir(editionSlug)
    const doesItExist = RNFS.exists(editionPath)
    if (doesItExist) {
        await RNFS.unlink(editionPath).catch(e =>
            errorService.captureException(e),
        )
        return true
    }
    return false
}

/**
 * Unfinished function!
 * @param editionsList needs to be passed in somehow
 */
const deleteOldEditions = async (editionsList: EditionsList) => {
    const allFolders = await RNFS.readDir(FSPaths.issuesDir)
    const editionFolders = allFolders.filter(f => f.name !== 'download')
    const downloadFolders = RNFS.readDir(FSPaths.downloadRoot)

    console.log(allFolders, editionFolders)
    // difficult to fetch editions list here as useEditions is a hook so probably
    // need to pass it in

    deleteIssues(await getLocalIssues(edition), 'clearExpiredEditionIssues)

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

export { clearOldIssues, deleteIssueFiles, clearDownloadsDirectory }
