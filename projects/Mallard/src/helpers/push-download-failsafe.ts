import BackgroundFetch from 'react-native-background-fetch';
import { prepareAndDownloadTodaysIssue } from 'src/download-edition/prepare-and-download-issue';
import type { NetInfoState } from 'src/hooks/use-net-info-provider';
import { pushTracking } from '../notifications/push-tracking';

const pushDownloadFailsafe = (
	downloadBlocked: NetInfoState['downloadBlocked'],
) => {
	BackgroundFetch.configure(
		{
			minimumFetchInterval: 120, // Every 2 hours
			stopOnTerminate: false,
			startOnBoot: true,
		},
		async () => {
			await pushTracking('backgroundFetch', 'started');
			await prepareAndDownloadTodaysIssue(downloadBlocked);
			await pushTracking('backgroundFetch', 'ended');
			BackgroundFetch.finish();
		},
		(error) => {
			pushTracking('backgroundFetchError', error.toString());
		},
	);

	const ID = 'backgroundFetchStatus';
	BackgroundFetch.status((status) => {
		switch (status) {
			case BackgroundFetch.STATUS_RESTRICTED:
				pushTracking(ID, 'restricted');
				break;
			case BackgroundFetch.STATUS_DENIED:
				pushTracking(ID, 'denied');
				break;
			case BackgroundFetch.STATUS_AVAILABLE:
				pushTracking(ID, 'enabled');
				break;
		}
	});
};

export { pushDownloadFailsafe };
