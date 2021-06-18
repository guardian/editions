import type ApolloClient from 'apollo-client';
import retry from 'async-retry';
import gql from 'graphql-tag';
import type { DLStatus } from 'src/helpers/files';
import {
	downloadNamedIssueArchive,
	unzipNamedIssueArchive,
} from 'src/helpers/files';
import { localIssueListStore } from 'src/hooks/use-issue-on-device';
import type { NetInfo } from 'src/hooks/use-net-info';
import { DownloadBlockedStatus } from 'src/hooks/use-net-info';
import { pushTracking } from 'src/notifications/push-tracking';
import { FSPaths } from 'src/paths';
import { errorService } from 'src/services/errors';
import { remoteConfigService } from 'src/services/remote-config';
import type { ImageSize, IssueSummary } from '../../../Apps/common/src';
import { Feature } from '../../../Apps/common/src/logging';
import { deleteIssue } from './clear-issues-and-editions';

type DlBlkQueryValue = { netInfo: Pick<NetInfo, 'downloadBlocked'> };
const DOWNLOAD_BLOCKED_QUERY = gql`
	{
		netInfo @client {
			downloadBlocked @client
		}
	}
`;

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

const downloadSSRBundle = async (issue: IssueSummary, imageSize: ImageSize) => {
	const { assets, localId } = issue;

	if (assets) {
		const htmlAssetPath = assets.data.replace('data.zip', 'ssr/html.zip');
		const htmlDownloadResult = await downloadNamedIssueArchive({
			localIssueId: localId,
			assetPath: htmlAssetPath,
			filename: 'ssr-html.zip',
			withProgress: false,
		});
		console.log(
			`SSR html.zip download completed with status:${htmlDownloadResult.statusCode}`,
		);
		await unzipNamedIssueArchive(
			`${FSPaths.downloadIssueLocation(localId)}/ssr-html.zip`,
		);
		console.log('SSR html unzipped');

		const originalImgAsset = assets[imageSize] as string;
		const ssrImgPath = originalImgAsset.replace(
			`${imageSize}.zip`,
			`ssr/${imageSize}.zip`,
		);
		const downloadSSRImgFileName = `ssr-${imageSize}.zip`;
		const dlSSRImg = await downloadNamedIssueArchive({
			localIssueId: localId,
			assetPath: ssrImgPath,
			filename: downloadSSRImgFileName,
			withProgress: false,
		});
		console.log(
			`SSR image download completed with status: ${dlSSRImg.statusCode}`,
		);
		await unzipNamedIssueArchive(
			`${FSPaths.downloadIssueLocation(
				localId,
			)}/${downloadSSRImgFileName}`,
		);
		console.log('SSR image unzipped');
	}
};

const runDownload = async (issue: IssueSummary, imageSize: ImageSize) => {
	const { assets, localId } = issue;

	try {
		if (!assets) {
			await pushTracking('noAssets', 'complete', Feature.DOWNLOAD);
			return;
		}

		await pushTracking(
			'attemptDataDownload',
			JSON.stringify({ localId, assets: assets.data }),
			Feature.DOWNLOAD,
		);

		const ssrBundleDownloadEnabled = remoteConfigService.getBoolean(
			'download_parallel_ssr_bundle',
		);

		await retry(
			async () => {
				// To give a artificial visual indication move the progressbar a little
				updateListeners(localId, {
					type: 'download',
					data: 1.0,
				});
				const dataDownloadResult = await downloadNamedIssueArchive({
					localIssueId: localId,
					assetPath: assets.data,
					filename: 'data.zip',
					withProgress: false,
				});
				console.log(
					`data.zip download completed with status:${dataDownloadResult.statusCode}`,
				);

				await pushTracking(
					'attemptDataDownload',
					'completed',
					Feature.DOWNLOAD,
				);

				if (ssrBundleDownloadEnabled) {
					console.log('Parallel SSR bundle download is ENABLED');
					await downloadSSRBundle(issue, imageSize);
				} else {
					console.log('Parallel SSR bundle download is DISABLED');
				}

				await pushTracking(
					'attemptMediaDownload',
					JSON.stringify({ localId, assets: assets[imageSize] }),
					Feature.DOWNLOAD,
				);

				const dlImg = await downloadNamedIssueArchive({
					localIssueId: localId,
					assetPath: assets[imageSize] as string,
					filename: 'media.zip',
					withProgress: true,
				});
				console.log(
					`media.zip download completed with status: ${dlImg.statusCode}`,
				);

				await pushTracking(
					'attemptMediaDownload',
					'completed',
					Feature.DOWNLOAD,
				);

				updateListeners(localId, {
					type: 'unzip',
					data: 'start',
				});

				await pushTracking('unzipData', 'start', Feature.DOWNLOAD);

				await unzipNamedIssueArchive(
					`${FSPaths.downloadIssueLocation(localId)}/data.zip`,
				);
				console.log('data.zip unzipped');

				await pushTracking('unzipData', 'end', Feature.DOWNLOAD);

				await pushTracking('unzipImages', 'start', Feature.DOWNLOAD);

				await unzipNamedIssueArchive(
					`${FSPaths.downloadIssueLocation(localId)}/media.zip`,
				);
				console.log('media.zip unzipped');

				await pushTracking('unzipImages', 'end', Feature.DOWNLOAD);

				return 'success';
			},
			{
				retries: 2,
			},
		);

		await pushTracking('downloadAndUnzip', 'complete', Feature.DOWNLOAD);
		updateListeners(localId, { type: 'success' }); // null is unstarted or end
	} catch (error) {
		await pushTracking(
			'downloadAndUnzipError',
			JSON.stringify(error),
			Feature.DOWNLOAD,
		);
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
	client: ApolloClient<object>,
	issue: IssueSummary,
	imageSize: ImageSize,
	onProgress: (status: DLStatus) => void = () => {},
	run = runDownload,
) => {
	const queryResult = await client.query<DlBlkQueryValue>({
		query: DOWNLOAD_BLOCKED_QUERY,
	});
	const {
		netInfo: { downloadBlocked },
	} = queryResult.data;

	if (downloadBlocked !== DownloadBlockedStatus.NotBlocked) {
		await pushTracking(
			'downloadBlocked',
			DownloadBlockedStatus[downloadBlocked],
			Feature.DOWNLOAD,
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
			await pushTracking(
				'completeAndDeleteCache',
				'completed',
				Feature.DOWNLOAD,
			);
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
