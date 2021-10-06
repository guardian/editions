// Welcome to the main entry point of the app.
//
// In this file, we'll be kicking off our app or storybook.

import { ApolloProvider } from '@apollo/react-hooks';
import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { eventEmitter } from 'src/helpers/event-emitter';
import { weatherHider } from 'src/helpers/weather-hider';
import { ConfigProvider } from 'src/hooks/use-config-provider';
import { NavPositionProvider } from 'src/hooks/use-nav-position';
import { setUserId } from 'src/services/ophan';
import { AppNavigation } from './AppNavigation';
import { AccessProvider } from './authentication/AccessContext';
import type { IdentityAuthData } from './authentication/authorizers/IdentityAuthorizer';
import type { AnyAttempt } from './authentication/lib/Attempt';
import { isValid } from './authentication/lib/Attempt';
import { BugButtonHandler } from './components/Button/BugButtonHandler';
import { ErrorBoundary } from './components/layout/ui/errors/error-boundary';
import { Modal, ModalRenderer } from './components/modal';
import { NetInfoAutoToast } from './components/toast/net-info-auto-toast';
import { prepFileSystem } from './helpers/files';
import { nestProviders } from './helpers/provider';
import { AppStateProvider } from './hooks/use-app-state-provider';
import { EditionProvider } from './hooks/use-edition-provider';
import { PrepareAndDownloadTodaysIssue } from './hooks/use-issue-downloads';
import { IssueSummaryProvider } from './hooks/use-issue-summary-provider';
import { LoggingInitialiser } from './hooks/use-logging';
import { NetInfoProvider } from './hooks/use-net-info-provider';
import { SettingsOverlayProvider } from './hooks/use-settings-overlay';
import { ToastProvider } from './hooks/use-toast';
import { DeprecateVersionModal } from './screens/deprecate-screen';
import { apolloClient } from './services/apollo-singleton';
import { errorService } from './services/errors';
import { remoteConfigService } from './services/remote-config';

// Log Intitialisation
if (!__DEV__) {
	errorService.init(apolloClient);
}
remoteConfigService.init();

// --- SETUP OPERATIONS ---
prepFileSystem();

const styles = StyleSheet.create({
	appContainer: {
		flex: 1,
		backgroundColor: '#000',
	},
});

const persistenceKey = 'dev-nav-key-232asfdffgdfg1asdffgfdgfdga3413';

const isReactNavPersistenceError = (e: Error) =>
	__DEV__ && e.message.includes('There is no route defined for');

const WithProviders = nestProviders(
	Modal,
	ToastProvider,
	NavPositionProvider,
	ConfigProvider,
	EditionProvider,
	SettingsOverlayProvider,
	AppStateProvider,
	NetInfoProvider,
	LoggingInitialiser,
	IssueSummaryProvider,
	PrepareAndDownloadTodaysIssue,
);

const handleIdStatus = (attempt: AnyAttempt<IdentityAuthData>) =>
	setUserId(isValid(attempt) ? attempt.data.userDetails.id : null);

export default class App extends React.Component {
	componentDidMount() {
		SplashScreen.hide();
		{
			eventEmitter.on('editionCachesSet', () => {
				weatherHider(apolloClient);
			});
		}
	}

	async componentDidCatch(e: Error) {
		/**
		 * use an heuristic to check whether this is a react-nav error
		 * if it is then ditch our persistence and try to re-render
		 */
		if (isReactNavPersistenceError(e)) {
			await AsyncStorage.removeItem(persistenceKey);
			this.forceUpdate();
		}
	}
	/**
	 * When the component is mounted. This happens asynchronously and simply
	 * re-renders when we're good to go.
	 */
	render() {
		return (
			<ErrorBoundary>
				<ApolloProvider client={apolloClient}>
					<WithProviders>
						<AccessProvider onIdentityStatusChange={handleIdStatus}>
							<StatusBar
								barStyle="light-content"
								backgroundColor="#041f4a"
							/>
							<View style={styles.appContainer}>
								<AppNavigation />
								<NetInfoAutoToast />
							</View>
							<ModalRenderer />
							<BugButtonHandler />
							<DeprecateVersionModal />
						</AccessProvider>
					</WithProviders>
				</ApolloProvider>
			</ErrorBoundary>
		);
	}
}

/**
 * This needs to match what's found in your app_delegate.m and MainActivity.java.
 */

export const APP_NAME = 'Mallard';
