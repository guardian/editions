// Hook to initialise the file system and download today's issue if appropriate

import { useEffect } from 'react';
import { prepareAndDownloadTodaysIssue } from 'src/download-edition/prepare-and-download-issue';
import { pushDownloadFailsafe } from 'src/helpers/push-download-failsafe';
import { pushNotificationRegistration } from 'src/notifications/push-notifications';
import { useAppState } from './use-app-state-provider';
import { useApiUrl, useLargeDeviceMemory } from './use-config-provider';
import { useNetInfo } from './use-net-info-provider';

export const useIssueDownloads = () => {
	const { isPreview } = useApiUrl();
	const { downloadBlocked } = useNetInfo();
	const { isActive } = useAppState();
	const largeRAM = useLargeDeviceMemory();

	useEffect(() => {
		if (!isPreview) {
			prepareAndDownloadTodaysIssue(downloadBlocked);
			// On mount, if there is plenty of memory then setup the failsafe for push downloads
			if (largeRAM) {
				pushDownloadFailsafe(downloadBlocked);
			}
			// Initial app registration for Push Notifications
			pushNotificationRegistration(downloadBlocked);
		}
	}, []);

	useEffect(() => {
		// we check the value so that we dont run the function if it changes from true to false.
		if (isActive && !isPreview) {
			prepareAndDownloadTodaysIssue(downloadBlocked);
		}
	}, [isActive]);

	// May want to reinitialise this or not based on if the downloadBlocked status changes
	useEffect(() => {
		if (largeRAM) {
			pushDownloadFailsafe(downloadBlocked);
		}
		// Update the notifications based on downloadBlocked status
		pushNotificationRegistration(downloadBlocked);
	}, [downloadBlocked]);
};
