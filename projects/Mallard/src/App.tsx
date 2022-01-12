// Welcome to the main entry point of the app.
//
// In this file, we'll be kicking off our app or storybook.

import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
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
import { CoreProvider } from './hooks/use-core-provider';
import { EditionProvider } from './hooks/use-edition-provider';
import { GDPRProvider } from './hooks/use-gdpr';
import { IssueProvider } from './hooks/use-issue-provider';
import { IssueSummaryProvider } from './hooks/use-issue-summary-provider';
import { NetInfoProvider } from './hooks/use-net-info-provider';
import { SettingsOverlayProvider } from './hooks/use-settings-overlay';
import { ToastProvider } from './hooks/use-toast';
import { WeatherProvider } from './hooks/use-weather-provider';
import { DeprecateVersionModal } from './screens/deprecate-screen';
import { remoteConfigService } from './services/remote-config';

remoteConfigService.init();

// --- SETUP OPERATIONS ---
prepFileSystem();

const styles = StyleSheet.create({
	appContainer: {
		flex: 1,
		backgroundColor: '#000',
	},
});

const WithProviders = nestProviders(
	Modal,
	ToastProvider,
	NavPositionProvider,
	ConfigProvider,
	SettingsOverlayProvider,
	AppStateProvider,
	NetInfoProvider,
	EditionProvider,
	IssueSummaryProvider,
	IssueProvider,
	GDPRProvider,
	CoreProvider,
	WeatherProvider,
);

const handleIdStatus = (attempt: AnyAttempt<IdentityAuthData>) =>
	setUserId(isValid(attempt) ? attempt.data.userDetails.id : null);

const App = () => {
	useEffect(() => {
		SplashScreen.hide();
	}, []);

	return (
		<ErrorBoundary>
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
		</ErrorBoundary>
	);
};

export default App;

/**
 * This needs to match what's found in your app_delegate.m and MainActivity.java.
 */

export const APP_NAME = 'Mallard';
