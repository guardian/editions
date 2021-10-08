import { downloadTodaysIssue } from 'src/download-edition/download-todays-issue';
import { largeDeviceMemory } from 'src/hooks/use-config-provider';
import type { NetInfoState } from 'src/hooks/use-net-info-provider';
import { fetchCacheClear } from '../helpers/fetch';
import { prepFileSystem } from '../helpers/files';
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
	const weOk = await fetchCacheClear();
	if (weOk) {
		// Check to see if the device has a decent amount of memory before doing intensive tasks
		const largeRAM = await largeDeviceMemory();
		if (largeRAM) {
			return await downloadTodaysIssue(downloadBlocked);
		}
		return;
	}
};

export { prepareAndDownloadTodaysIssue };
