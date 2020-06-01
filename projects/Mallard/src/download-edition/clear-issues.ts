/**
 * rn-fetch-blob stores the zip file we donwnload in a temporary file. Sometimes,
 * the process that deletes these post extraction fails. This function attempts
 * to clean up such files in a fairly stupid way - just searching for files
 * with RNFetchBlobTmp at the start of the filename
 */

import RNFS from 'react-native-fs'
import { pushTracking } from 'src/push-notifications/push-tracking'
import { Feature } from '../../../Apps/common/src/logging'
import { errorService } from 'src/services/errors'
import { FSPaths } from 'src/paths'
import { localIssueListStore } from 'src/hooks/use-issue-on-device'
import {
    prepFileSystem,
    getLocalIssues,
    issuesToDelete,
} from 'src/helpers/files'
import { crashlyticsService } from 'src/services/crashlytics'

// for cleaning up temporary files when the user hits 'delete all downlods'
// NOTE: these hard coded names may change when rn-fetch-blob is updated

// CONSIDER RNFS.TemporaryDirectoryPath (needs testing)
const TEMP_FILE_LOCATIONS = [
    `${RNFS.DocumentDirectoryPath}/`,
    `${RNFS.DocumentDirectoryPath}/RNFetchBlob_tmp/`,
]
const RN_FETCH_TEMP_PREFIX = 'RNFetchBlobTmp'

// const removeTempFiles = () => {
//     const removeOrphanedTempFiles = async (dir: string) => {
//         try {
//             const isDir = await RNFetchBlob.fs.isDir(dir)
//             if (isDir) {
//                 RNFetchBlob.fs.ls(dir).then(files => {
//                     files
//                         .filter(f => f.startsWith(RN_FETCH_TEMP_PREFIX))
//                         .map(f => dir + f)
//                         .map(RNFetchBlob.fs.unlink)
//                 })
//             }
//         } catch (error) {
//             await pushTracking(
//                 'tempFileRemoveError',
//                 JSON.stringify(error),
//                 Feature.CLEAR_ISSUES,
//             )
//             console.log(
//                 `Error cleaning up temp issue files in directory ${dir}: `,
//                 error,
//             )
//             errorService.captureException(error)
//         }
//     }
//     TEMP_FILE_LOCATIONS.forEach(removeOrphanedTempFiles)
// }

const deleteIssue = (localId: string): Promise<void> => {
    const promise = RNFS.unlink(FSPaths.issueRoot(localId)).catch(e => {
        errorService.captureException(e)
        crashlyticsService.captureException(e)
    })
    promise.then(() => localIssueListStore.remove(localId))
    return promise
}

const deleteIssueFiles = async (): Promise<void> => {
    await RNFS.unlink(FSPaths.issuesDir)
    localIssueListStore.reset()

    // removeTempFiles()

    await prepFileSystem()
}

const clearOldIssues = async (): Promise<void> => {
    // remove any temp files at this point too
    // removeTempFiles()
    console.log('temp path', RNFS.TemporaryDirectoryPath)

    const files = await getLocalIssues()
    console.log(files)

    const iTD: string[] = await issuesToDelete(files)

    return Promise.all(iTD.map((issue: string) => deleteIssue(issue)))
        .then(() =>
            pushTracking('clearOldIssues', 'completed', Feature.CLEAR_ISSUES),
        )
        .catch(e => {
            errorService.captureException(e)
            crashlyticsService.captureException(e)
        })
}

export { clearOldIssues, deleteIssueFiles }
