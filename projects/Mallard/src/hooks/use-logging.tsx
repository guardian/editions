import { useApolloClient } from '@apollo/react-hooks';
import React, { useEffect } from 'react';
import type { AppStateStatus } from 'react-native';
import { AppState } from 'react-native';
import { loggingService } from 'src/services/logging';
import { useNetInfo } from './use-net-info-provider';

/** Purpose it to use the same singleton instance of Logging, however, hook into netinfo changes to update its internal state */
export const LoggingInitialiser = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const apolloClient = useApolloClient();
	const { isConnected, isPoorConnection, type } = useNetInfo();

	// Post backlog of logs when the component is created
	loggingService.postLogs();

	useEffect(() => {
		loggingService.init({
			apolloClient,
			isConnected,
			isPoorConnection,
			networkStatus: type,
		});
	}, [isConnected, isPoorConnection, type]);

	// Post backlog of logs whenever the app is foregrounded
	useEffect(() => {
		const appChangeEventHandler = async (appState: AppStateStatus) =>
			appState === 'active' && loggingService.postLogs();

		AppState.addEventListener('change', appChangeEventHandler);

		return () => {
			AppState.removeEventListener('change', appChangeEventHandler);
		};
	});

	return <>{children}</>;
};
