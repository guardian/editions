import BackgroundFetch from 'react-native-background-fetch';
import { prepareAndDownloadTodaysIssue } from 'src/download-edition/prepare-and-download-issue';
import type { NetInfoState } from 'src/hooks/use-net-info-provider';
import { Feature } from 'src/services/logging';
import { pushTracking } from '../notifications/push-tracking';

const feature = Feature.BACKGROUNG_DOWNLOAD;

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
			await pushTracking('backgroundFetch', 'started', feature);
			await prepareAndDownloadTodaysIssue(downloadBlocked);
			await pushTracking('backgroundFetch', 'ended', feature);
			BackgroundFetch.finish();
		},
		(error) => {
			pushTracking('backgroundFetchError', error.toString(), feature);
		},
	);

	const ID = 'backgroundFetchStatus';
	BackgroundFetch.status((status) => {
		switch (status) {
			case BackgroundFetch.STATUS_RESTRICTED:
				pushTracking(ID, 'restricted', feature);
				break;
			case BackgroundFetch.STATUS_DENIED:
				pushTracking(ID, 'denied', feature);
				break;
			case BackgroundFetch.STATUS_AVAILABLE:
				pushTracking(ID, 'enabled', feature);
				break;
		}
	});
};

export { pushDownloadFailsafe };
