import { findIssueSummaryByKey } from '../helpers/files';
import { imageForScreenSize } from '../helpers/screen';
import { getIssueSummary } from '../hooks/use-issue-summary-provider';
import type { NetInfoState } from '../hooks/use-net-info-provider';
import { pushTracking } from '../notifications/push-tracking';
import { errorService } from '../services/errors';
import { clearOldIssues } from './clear-issues-and-editions';
import { downloadAndUnzipIssue } from './download-and-unzip';

const downloadViaNotification = async (
	key: string,
	downloadBlocked: NetInfoState['downloadBlocked'],
) => {
	try {
		const screenSize = await imageForScreenSize();

		await pushTracking('pushScreenSize', screenSize);

		const issueSummaries = await getIssueSummary();

		await pushTracking('pushIssueSummaries', 'received');

		// Check to see if we can find the image summary for the one that is pushed
		const pushImageSummary = findIssueSummaryByKey(issueSummaries, key);

		await pushTracking(
			'pushImageSummary',
			JSON.stringify(pushImageSummary),
		);

		await downloadAndUnzipIssue(
			pushImageSummary,
			screenSize,
			downloadBlocked,
		);

		await pushTracking('pushDownloadComplete', 'completed');
	} catch (e) {
		await pushTracking('pushDownloadError', JSON.stringify(e));
		errorService.captureException(e);
		throw e;
	} finally {
		// No matter what happens, always clear up old issues
		await clearOldIssues();
	}
};

export { downloadViaNotification };
