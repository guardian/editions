import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppNavigation } from './AppNavigation';
import { AccessProvider } from './authentication/AccessContext';
import type { IdentityAuthData } from './authentication/authorizers/IdentityAuthorizer';
import type { OktaAuthData } from './authentication/authorizers/OktaAuthorizer';
import type { AnyAttempt } from './authentication/lib/Attempt';
import { isValid } from './authentication/lib/Attempt';
import { oktaInitialisation } from './authentication/services/okta';
import { BugButtonHandler } from './components/Button/BugButtonHandler';
import { ErrorBoundary } from './components/layout/ui/errors/error-boundary';
import { logUserId } from './helpers/analytics';
import { prepFileSystem } from './helpers/files';
import { nestProviders } from './helpers/provider';
import { AppStateProvider } from './hooks/use-app-state-provider';
import { ConfigProvider } from './hooks/use-config-provider';
import { CoreProvider } from './hooks/use-core-provider';
import { EditionProvider } from './hooks/use-edition-provider';
import { GDPRProvider } from './hooks/use-gdpr';
import { IssueProvider } from './hooks/use-issue-provider';
import { IssueSummaryProvider } from './hooks/use-issue-summary-provider';
import { NavPositionProvider } from './hooks/use-nav-position';
import { NetInfoProvider } from './hooks/use-net-info-provider';
import { SettingsOverlayProvider } from './hooks/use-settings-overlay';
import { ToastProvider } from './hooks/use-toast';
import { WeatherProvider } from './hooks/use-weather-provider';
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
	logUserId(
		isValid(attempt) ? attempt.data.userDetails.id : null,
		'identity',
	);

const handleOktaStatus = (attempt: AnyAttempt<OktaAuthData>) =>
	logUserId(
		isValid(attempt) ? attempt.data.userDetails.legacy_identity_id : null,
		'okta',
	);

const App = () => {
	useEffect(() => {
		oktaInitialisation();
	}, []);

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<ErrorBoundary>
				<ActionSheetProvider>
					<WithProviders>
						<AccessProvider
							onIdentityStatusChange={handleIdStatus}
							onOktaStatusChange={handleOktaStatus}
						>
							<StatusBar
								barStyle="light-content"
								backgroundColor="#041f4a"
							/>
							<View style={styles.appContainer}>
								<AppNavigation />
							</View>
							<BugButtonHandler />
						</AccessProvider>
					</WithProviders>
				</ActionSheetProvider>
			</ErrorBoundary>
		</GestureHandlerRootView>
	);
};

export default App;

/**
 * This needs to match what's found in your app_delegate.m and MainActivity.java.
 */

export const APP_NAME = 'Mallard';
