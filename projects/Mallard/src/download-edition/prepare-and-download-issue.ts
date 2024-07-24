import { downloadTodaysIssue } from '../download-edition/download-todays-issue';
import { prepFileSystem } from '../helpers/files';
import { largeDeviceMemory } from '../hooks/use-config-provider';
import type { NetInfoState } from '../hooks/use-net-info-provider';
import { cleanPushTrackingByDays } from '../notifications/push-tracking';
import {
	cleanOldEditions,
	clearDownloadsDirectory,
	clearOldIssues,
} from './clear-issues-and-editions';

const prepareAndDownloadTodaysIssue = async (
	downloadBlocked: NetInfoState['downloadBlocked'],
) => {
	await prepFileSystem();
	await clearOldIssues();
	await clearDownloadsDirectory();
	await cleanOldEditions();
	await cleanPushTrackingByDays();
	// Check to see if the device has a decent amount of memory before doing intensive tasks
	const largeRAM = await largeDeviceMemory();
	if (largeRAM) {
		return setTimeout(
			async () => await downloadTodaysIssue(downloadBlocked),
			5000,
		);
	}
	return;
};

export { prepareAndDownloadTodaysIssue };
