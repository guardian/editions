import RNFS from 'react-native-fs'
import { pushTracking } from 'src/notifications/push-tracking'
import { Feature } from '../../../Apps/common/src/logging'
import { errorService } from 'src/services/errors'
import { FSPaths } from 'src/paths'
import { localIssueListStore } from 'src/hooks/use-issue-on-device'
import {
    prepFileSystem,
    getLocalIssues,
    issuesToDelete,
} from 'src/helpers/files'

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

const deleteIssue = async (localId: string): Promise<boolean> => {
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

const clearOldIssues = async (): Promise<void> => {
    const files = await getLocalIssues()

    const iTD: string[] = await issuesToDelete(files)

    return Promise.all(iTD.map((issue: string) => deleteIssue(issue)))
        .then(() =>
            pushTracking('clearOldIssues', 'completed', Feature.CLEAR_ISSUES),
        )
        .catch(e => {
            errorService.captureException(e)
        })
}

export { clearOldIssues, deleteIssueFiles, clearDownloadsDirectory }
