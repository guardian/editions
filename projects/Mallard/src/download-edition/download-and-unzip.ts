import retry from 'async-retry';
import type { DLStatus } from 'src/helpers/files';
import {
	downloadNamedIssueArchive,
	unzipNamedIssueArchive,
} from 'src/helpers/files';
import { localIssueListStore } from 'src/hooks/use-issue-on-device';
import type { NetInfoState } from 'src/hooks/use-net-info-provider';
import { DownloadBlockedStatus } from 'src/hooks/use-net-info-provider';
import { pushTracking } from 'src/notifications/push-tracking';
import { FSPaths } from 'src/paths';
import { errorService } from 'src/services/errors';
import type { ImageSize, IssueSummary } from '../../../Apps/common/src';
import { deleteIssue } from './clear-issues-and-editions';

// Cache of current downloads
const dlCache: Record<
	string,
	{
		promise: Promise<void>;
		progressListeners: Array<(status: DLStatus) => void>;
	}
> = {};

export const maybeListenToExistingDownload = (
	issue: IssueSummary,
	onProgress: (status: DLStatus) => void = () => {},
) => {
	const dl = dlCache[issue.localId];
	if (dlCache[issue.localId]) {
		dl.progressListeners.push(onProgress);
		return dl.promise;
	}
	return false;
};

export const stopListeningToExistingDownload = (
	issue: IssueSummary,
	listener: (status: DLStatus) => void,
) => {
	const dl = dlCache[issue.localId];
	if (dlCache[issue.localId]) {
		const index = dl.progressListeners.indexOf(listener);
		if (index < 0) return;
		dl.progressListeners.splice(index, 1);
	}
};

// for testing
export const updateListeners = (localId: string, status: DLStatus) => {
	const listeners = (dlCache[localId] || {}).progressListeners || [];
	listeners.forEach((listener) => listener(status));
};

const runDownload = async (issue: IssueSummary, imageSize: ImageSize) => {
	const { assets, assetsSSR, localId } = issue;

	try {
		if (!assets || !assetsSSR) {
			await pushTracking('noAssets', 'complete');
			return;
		}

		await retry(
			async () => {
				// --- Data Download ---

				await pushTracking(
					'attemptDataDownload',
					JSON.stringify({ localId, assets: assets.data }),
				);

				// We are not asking for progress update during Data bundle download (to avoid false visual completion)
				// So, instead we are artificially triggering a small progress update to render some visual change
				updateListeners(localId, {
					type: 'download',
					data: 0.5,
				});
				const dataDownloadResult = await downloadNamedIssueArchive({
					localIssueId: localId,
					assetPath: assets.data,
					filename: 'data.zip',
					withProgress: false,
				});
				console.log(
					`Data download completed with status: ${dataDownloadResult.statusCode}`,
				);

				await pushTracking('attemptDataDownload', 'completed');

				// --- HTML Download ---

				await pushTracking(
					'attemptHTMLDownload',
					JSON.stringify({ localId, assets: assetsSSR.html }),
				);

				await downloadNamedIssueArchive({
					localIssueId: localId,
					assetPath: assetsSSR.html,
					filename: 'html.zip',
					withProgress: false,
				});

				await pushTracking('attemptHTMLDownload', 'completed');

				// --- Media Download ---

				await pushTracking(
					'attemptMediaDownload',
					JSON.stringify({ localId, assets: assetsSSR[imageSize] }),
				);

				await downloadNamedIssueArchive({
					localIssueId: localId,
					assetPath: assetsSSR[imageSize] as string,
					filename: 'media.zip',
					withProgress: true,
				});

				await pushTracking('attemptMediaDownload', 'completed');

				updateListeners(localId, {
					type: 'unzip',
					data: 'start',
				});

				// --- Data Unzip ---

				await pushTracking('unzipData', 'start');

				await unzipNamedIssueArchive(
					`${FSPaths.downloadIssueLocation(localId)}/data.zip`,
				);

				await pushTracking('unzipData', 'end');

				// --- HTML Unzip ---

				await pushTracking('unzipHTML', 'start');

				await unzipNamedIssueArchive(
					`${FSPaths.downloadIssueLocation(localId)}/html.zip`,
				);

				await pushTracking('unzipHTML', 'end');

				// --- Image Unzip ---

				await pushTracking('unzipImages', 'start');

				await unzipNamedIssueArchive(
					`${FSPaths.downloadIssueLocation(localId)}/media.zip`,
				);

				await pushTracking('unzipImages', 'end');

				return 'success';
			},
			{
				retries: 2,
			},
		);

		await pushTracking('downloadAndUnzip', 'complete');
		updateListeners(localId, { type: 'success' }); // null is unstarted or end
	} catch (error) {
		await pushTracking('downloadAndUnzipError', JSON.stringify(error));
		errorService.captureException(error);
		updateListeners(localId, { type: 'failure', data: error });
		console.log('Download error: ', error);

		// To avoid having part of issue data on the device (i.e. when image bundle failed to unzip)
		// we are clearing the folder, so user does not experience article without image, for example.
		deleteIssue(localId);
	}
};

// This caches downloads so that if there is one already running you
// will get a reference to that rather promise than triggering a new one
export const downloadAndUnzipIssue = async (
	issue: IssueSummary,
	imageSize: ImageSize,
	downloadBlocked: NetInfoState['downloadBlocked'],
	onProgress: (status: DLStatus) => void = () => {},
	run = runDownload,
) => {
	if (downloadBlocked !== DownloadBlockedStatus.NotBlocked) {
		await pushTracking(
			'downloadBlocked',
			DownloadBlockedStatus[downloadBlocked],
		);
		return;
	}

	const { localId } = issue;
	const promise = maybeListenToExistingDownload(issue, onProgress);
	if (promise) return promise;

	const createDownloadPromise = async () => {
		try {
			await run(issue, imageSize);
			localIssueListStore.add(localId);
		} finally {
			await pushTracking('completeAndDeleteCache', 'completed');
			delete dlCache[localId];
		}
	};

	const downloadPromise = createDownloadPromise();

	dlCache[localId] = {
		promise: downloadPromise,
		progressListeners: [onProgress],
	};
	return downloadPromise;
};
