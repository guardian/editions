import { useEffect } from 'react';
import { loggingService } from 'src/services/logging';
import { useAppState } from './use-app-state-provider';
import { useGdprSettings } from './use-gdpr';
import { useNetInfo } from './use-net-info-provider';

/** Purpose it to use the same singleton instance of Logging, however, hook into netinfo changes to update its internal state */
export const useLogging = () => {
	const { isConnected, isPoorConnection, type } = useNetInfo();
	const { gdprAllowPerformance } = useGdprSettings();
	const { isActive } = useAppState();

	// Post backlog of logs when the component is created
	loggingService.postLogs();

	useEffect(() => {
		loggingService.init({
			hasConsent: gdprAllowPerformance,
			isConnected,
			isPoorConnection,
			networkStatus: type,
		});
	}, [isConnected, isPoorConnection, type, gdprAllowPerformance]);

	// Post backlog of logs whenever the app is foregrounded
	useEffect(() => {
		isActive && loggingService.postLogs();
	}, [isActive]);
};
