import RNFS from 'react-native-fs';
import { unzip } from 'react-native-zip-archive';
import type { Issue, IssueSummary } from '../common';
import { getEditionIds } from '../common';
import { updateListeners } from '../download-edition/download-and-unzip';
import { editionsListCache, issueSummaryCache } from '../helpers/storage';
import {
	getApiUrlSetting,
	getMaxAvailableEditions,
} from '../hooks/use-config-provider';
import { getSelectedEditionSlug } from '../hooks/use-edition-provider';
import { FSPaths } from '../paths';
import { errorService } from '../services/errors';
import { londonTime } from './date';

// matches the issue date, i.e. 2020-02-01
const ISSUE_DATE_REGEX = /\d{4}-\d{2}-\d{2}/gm;

export type DLStatus =
	| { type: 'download'; data: number }
	| { type: 'unzip'; data: 'start' }
	| { type: 'success' }
	| { type: 'failure' };

export const ensureDirExists = (dir: string): Promise<void> =>
	RNFS.mkdir(dir).catch(() => Promise.resolve());

/*
We always try to prep the file system before accessing issuesDir
*/
export const prepFileSystem = async (): Promise<void> => {
	await ensureDirExists(FSPaths.issuesDir);
	await ensureDirExists(FSPaths.downloadRoot);
	const editionsList = await editionsListCache.get();
	const editionIds = getEditionIds(editionsList);

	await Promise.all(
		editionIds.map((edition) =>
			ensureDirExists(`${FSPaths.issuesDir}/${edition}`),
		),
	);
	await Promise.all(
		editionIds.map((edition) =>
			ensureDirExists(`${FSPaths.downloadRoot}/${edition}`),
		),
	);
};

export const readFileAsJSON = (path: string): Promise<any> =>
	RNFS.readFile(path, 'utf8').then((d) => JSON.parse(d));

export const downloadNamedIssueArchive = async ({
	localIssueId,
	assetPath,
	filename,
	withProgress,
}: {
	localIssueId: Issue['localId'];
	assetPath: string;
	filename: string;
	withProgress: boolean;
}) => {
	// @TODO: This value in future needs to come from React
	const apiUrl = await getApiUrlSetting();
	const zipUrl = `${apiUrl}${assetPath}`;
	const downloadFolderLocation = FSPaths.downloadIssueLocation(localIssueId);
	await prepFileSystem();
	await ensureDirExists(FSPaths.issueRoot(localIssueId));
	await ensureDirExists(downloadFolderLocation);

	const returnable = RNFS.downloadFile({
		fromUrl: zipUrl,
		toFile: `${downloadFolderLocation}/${filename}`,
		readTimeout: 300 * 1000, // set it to 5 mins, default is 15sec (android & iOS)
		connectionTimeout: 30 * 1000, // set it to 30sec, default is 5sec (android only)
		background: true,
		begin: () => console.log('start download'),
		progress: (response) => {
			if (withProgress) {
				const percentage =
					(response.bytesWritten / response.contentLength) * 100;
				updateListeners(localIssueId, {
					type: 'download',
					data: percentage,
				});
			}
		},
		progressInterval: 1,
	});

	return await returnable.promise;
};

export const unzipNamedIssueArchive = async (zipFilePath: string) => {
	const outputPath = FSPaths.issuesDir;

	try {
		await unzip(zipFilePath, outputPath);
		return RNFS.unlink(zipFilePath);
	} catch (e: any) {
		e.message = `${e.message} - zipFilePath: ${zipFilePath} - outputPath: ${outputPath}`;
		errorService.captureException(e);
		console.log('Unzip Error: ' + JSON.stringify(e));
	}
};

/**
 * Only return true if we have both directories
 */
export const isIssueOnDevice = async (
	localIssueId: Issue['localId'],
	// Please note, this makes an assumption on the location of filenames which is not the case throughout the code
	// However, at this stage in the project, this is unlikely to change and therefore the performance optimisation
	// that this currently provides is a greater benefit than maintenance.
	expectedFolders = ['issue', 'front', 'thumbs', 'media', 'html'],
): Promise<boolean> => {
	try {
		const folders = await RNFS.readdir(FSPaths.issueRoot(localIssueId));
		if (folders.length === 0) {
			return false;
		}
		return expectedFolders.every((item) => {
			return folders.includes(item);
		});
	} catch {
		return false;
	}
};

const withPathPrefix = (prefix: string) => (str: string) => `${prefix}/${str}`;

export const getLocalIssues = async (editionSlug: string) => {
	const editionDirectory = await FSPaths.editionDir(editionSlug);
	return RNFS.readdir(editionDirectory).then((files) =>
		files.map(withPathPrefix(editionSlug)),
	);
};

export const getIssuesCountStrings = async () => {
	const editionDirList = await FSPaths.edtionsDirList();
	const result: string[] = [];
	for (let i = 0; i < editionDirList.length; i++) {
		const dir = editionDirList[i];
		const files = await RNFS.readdir(dir);
		const issueFiles = files.filter(
			(file) => file.match(ISSUE_DATE_REGEX) != null,
		);
		result.push(`${dir.split('/').pop()}: ${issueFiles.length} issues`);
	}
	return result;
};

export const getIssuesToDelete = async (files: string[]) => {
	const maxAvailableEditions = await getMaxAvailableEditions();
	const totalIssues = files.length;

	if (totalIssues <= maxAvailableEditions) {
		console.log(
			`No Issues to delete: downloaded issues are ${files.length} and max number is ${maxAvailableEditions}`,
		);
		return [];
	}

	// sort in descending order so we can loop through it and keep the latest issues
	files.sort().reverse();

	const deleteList: string[] = [];
	let keepIssues = 0;

	for (let i = 0; i < totalIssues; i++) {
		const isAnIssue = files[i].match(ISSUE_DATE_REGEX) != null;
		if (isAnIssue && keepIssues < maxAvailableEditions) {
			keepIssues++;
			continue;
		}

		const canDelete = !files[i].endsWith('/issues');
		if (canDelete) deleteList.push(files[i]);
	}

	return deleteList;
};

export const findIssueSummaryByKey = (
	issueSummaries: IssueSummary[],
	key: string,
): IssueSummary => {
	const summaryMatch = issueSummaries.find(
		(issueSummary) => issueSummary.key === key,
	) as IssueSummary;
	return summaryMatch || null;
};

export const readIssueSummary = async (): Promise<IssueSummary[]> => {
	return issueSummaryCache
		.get()
		.then((data) => {
			try {
				if (data) {
					return JSON.parse(data);
				}
				return [];
			} catch (e: any) {
				e.message = `readIssueSummary: ${e.message} - with: ${data}`;
				console.log(e.message);
				errorService.captureException(e);
				throw e;
			}
		})
		.catch((e) => {
			throw e;
		});
};

export const fetchAndStoreIssueSummary = async (): Promise<IssueSummary[]> => {
	// @TODO: This value in future needs to come from React
	const apiUrl = await getApiUrlSetting();
	const edition = await getSelectedEditionSlug();

	const fetchIssueSummaryUrl = `${apiUrl}${edition}/issues`;
	console.log(fetchIssueSummaryUrl);

	try {
		const issueSummaryRequest = await fetch(fetchIssueSummaryUrl);
		const issueSummary = await issueSummaryRequest.json();
		if (!issueSummary || issueSummaryRequest.status !== 200) {
			throw new Error('No Issume Summary Avaialble');
		}

		const issueSummaryString = JSON.stringify(issueSummary);
		issueSummaryCache.set(issueSummaryString);
		// The above saves it locally, if successful we return it
		return issueSummary;
	} catch (e: any) {
		try {
			const issueSummary = await readIssueSummary();
			if (!issueSummary && e.message !== 'Network request failed') {
				e.message = `Failed to fetch valid issue summary and empty cache: ${e.message}`;
				errorService.captureException(e);
			}
			// Got a problem with the endpoint, return the last saved version
			return issueSummary;
		} catch {
			return [];
		}
	}
};

const cleanFileDisplay = (stat: RNFS.ReadDirItem) => ({
	path: stat.path.replace(FSPaths.issuesDir, ''),
	lastModified: stat.mtime ? londonTime(stat.mtime) : '',
	type: stat.isDirectory() ? 'directory' : 'file',
});

export const getFileList = async () => {
	const imageFolders: RNFS.ReadDirItem[] = [];
	const editionSlug = await getSelectedEditionSlug();
	const editionDirectory: string = await FSPaths.editionDir(editionSlug);
	const files = await RNFS.readDir(editionDirectory);

	const subfolders = await Promise.all(
		files.map((file) =>
			file.isDirectory()
				? RNFS.readDir(file.path).then((filestat) => ({
						[file.name]: filestat.map((deepfile) => {
							if (
								deepfile.name === 'media' ||
								deepfile.name === 'thumbs'
							) {
								imageFolders.push(deepfile);
							}
							return cleanFileDisplay(deepfile);
						}),
					}))
				: {},
		),
	);

	const cleanSubfolders = subfolders.filter(
		(value) => Object.keys(value).length !== 0,
	);

	// Grab one images from each image folder to confirm successful unzip
	const imageFolderSearch = await Promise.all(
		imageFolders.map(async (file: RNFS.ReadDirItem) => {
			return await RNFS.readDir(file.path)
				.then((filestat) =>
					filestat
						.map((deepfile) => cleanFileDisplay(deepfile))
						.slice(0, 1),
				)
				.catch((e) => {
					console.error(e);
				});
		}),
	);

	return [...cleanSubfolders, ...imageFolderSearch];
};
