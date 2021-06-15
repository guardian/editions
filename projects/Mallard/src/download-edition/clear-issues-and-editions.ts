import RNFS from 'react-native-fs';
import {
	getIssuesToDelete,
	getLocalIssues,
	prepFileSystem,
} from 'src/helpers/files';
import { getSetting } from 'src/helpers/settings';
import { editionsListCache } from 'src/helpers/storage';
import { getSelectedEditionSlug } from 'src/hooks/use-edition-provider';
import { localIssueListStore } from 'src/hooks/use-issue-on-device';
import type { PushTrackingId } from 'src/notifications/push-tracking';
import { pushTracking } from 'src/notifications/push-tracking';
import { FSPaths } from 'src/paths';
import { errorService } from 'src/services/errors';
import type { EditionId } from '../../../Apps/common/src';
import { getEditionIds } from '../../../Apps/common/src/helpers';
import { Feature } from '../../../Apps/common/src/logging';

const clearDownloadsDirectory = async () => {
	try {
		const files = await RNFS.readDir(FSPaths.downloadRoot);
		files.map(
			async (file: RNFS.ReadDirItem) =>
				await RNFS.unlink(file.path).catch(() => {
					// Android says nothing exists here but they are empty folders, so this supresses the warning
				}),
		);
		await Promise.all(files);
		await prepFileSystem();
	} catch (error) {
		await pushTracking(
			'tempFileRemoveError',
			JSON.stringify(error),
			Feature.CLEAR_ISSUES,
		);
		console.log(`Error cleaning up download issues folder `, error);
		errorService.captureException(error);
	}
};

export const deleteIssue = async (localId: string): Promise<boolean> => {
	const issuePath = FSPaths.issueRoot(localId);
	const doesItExist = await RNFS.exists(issuePath);
	if (doesItExist) {
		await RNFS.unlink(issuePath).catch((e) => {
			errorService.captureException(e);
		});
		localIssueListStore.remove(localId);
		return true;
	}
	return false;
};

const deleteIssueFiles = async (): Promise<void> => {
	await RNFS.unlink(FSPaths.issuesDir);
	localIssueListStore.reset();
	await prepFileSystem();
	await clearDownloadsDirectory();
};

const deleteIssues = (issuesToDelete: string[], trackingId: PushTrackingId) => {
	return Promise.all(
		issuesToDelete.map((issue: string) => deleteIssue(issue)),
	)
		.then(() => pushTracking(trackingId, 'completed', Feature.CLEAR_ISSUES))
		.catch((e) => {
			errorService.captureException(e);
		});
};

const clearOldIssues = async (): Promise<void> => {
	const edition = await getSelectedEditionSlug();
	const maxAvailableEditions = await getSetting('maxAvailableEditions');
	return clearOldIssuesForEdition(edition, maxAvailableEditions);
};

const clearOldIssuesForEdition = async (
	edition: string,
	maxAvailableEditions: number,
): Promise<void> => {
	const files = await getLocalIssues(edition);
	const issuesToDelete: string[] = await getIssuesToDelete(
		files,
		maxAvailableEditions,
	);
	console.log(
		`Total issues to be deleted for ${edition} is ${issuesToDelete.length}`,
	);
	return deleteIssues(issuesToDelete, 'clearOldIssues');
};

/**
 * Takes a list of directories and the current editions list and works out which directories
 * are safe to 'clean' - excluding those related to defaultRegionalEditions, hidden folders and
 * folders called 'download'
 * @param directoryList
 * @param editionList
 */
const editionDirsToClean = (
	directoryList: Array<{ name: string; path: string }>,
	editionList: EditionId[],
): Array<{ name: string; path: string }> => {
	// don't clean hidden folders, folders called 'download' or editions we want to keep
	return directoryList.filter(
		(d) =>
			!d.name.startsWith('.') &&
			d.name !== 'download' &&
			!editionList.includes(d.name),
	);
};

const getDirsToClean = async (path: string) => {
	const editionsList = await editionsListCache.get();
	const editionIds = getEditionIds(editionsList);
	const directories = await RNFS.readDir(path);
	return editionDirsToClean(directories, editionIds);
};

// deletes issue files in editon directories at <root>/
const deleteOldEditionIssues = async () => {
	const rootEditionFoldersToClean = await getDirsToClean(FSPaths.issuesDir);

	// we've had issues in the past with deleting issue folders, so just delete the issues for the edition
	const issuesToClear = await Promise.all(
		rootEditionFoldersToClean.map((e) => getLocalIssues(e.name)),
	);
	issuesToClear.forEach((issues) => {
		try {
			deleteIssues(issues, 'clearOldEditions');
		} catch (error) {
			errorService.captureException(error);
		}
	});
};

// deletes everything in the <root>/download/ directory
const cleanEditionsDownloadFolder = async () => {
	const downloadEditionFoldersToDelete = await getDirsToClean(
		FSPaths.downloadRoot,
	);
	downloadEditionFoldersToDelete.forEach((f) =>
		RNFS.unlink(f.path).catch((e) => {
			errorService.captureException(e);
		}),
	);
};

const cleanOldEditions = async () => {
	// we don't care *that* much if we fail to delete old editions so just log any errors to sentry
	try {
		await deleteOldEditionIssues();
		await cleanEditionsDownloadFolder();
	} catch (error) {
		errorService.captureException(error);
	}
};

const cleanNonERCompatibleDownloadedIssues = async () => {
	// *** THIS IS A MIGRATION STEP AND SHOULD NOT RUN MORE THAN ONCE ***
	// As part of ER work - where apps download rendered content bundle 'html'
	// and webview expect to receive a html file, all previously downloaded Issues
	// will not work (simply because they don't have 'html' folder in the bundle).
	// So clean all downloaded Issue and let users to chose download again.

	const editionsList = await editionsListCache.get();
	const regionalAndSpecialEditionIds = getEditionIds(editionsList);
	console.log(
		`Deleting issues for ${JSON.stringify(regionalAndSpecialEditionIds)}`,
	);
	regionalAndSpecialEditionIds.forEach(async (edition) => {
		console.log('Deleting all issues from: ' + edition);
		await clearOldIssuesForEdition(edition, 0);
	});
};

export {
	clearOldIssues,
	deleteIssueFiles,
	clearDownloadsDirectory,
	cleanOldEditions,
	editionDirsToClean,
	cleanNonERCompatibleDownloadedIssues,
};
