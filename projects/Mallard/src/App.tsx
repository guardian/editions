// Welcome to the main entry point of the app.
//
// In this file, we'll be kicking off our app or storybook.

import { ApolloProvider } from '@apollo/react-hooks'
import AsyncStorage from '@react-native-community/async-storage'
import React from 'react'
import { AppState, Platform, StatusBar, StyleSheet, View } from 'react-native'
import { enableScreens } from 'react-native-screens'
import SplashScreen from 'react-native-splash-screen'
import { NavigationState } from 'react-navigation'
import { NavPositionProvider } from 'src/hooks/use-nav-position'
import { RootNavigator } from 'src/navigation'
import {
    ScreenTracking,
    ScreenTrackingMapping,
    sendAppScreenEvent,
    setUserId,
} from 'src/services/ophan'
import { createApolloClient } from './apollo'
import { AccessProvider } from './authentication/AccessContext'
import { IdentityAuthData } from './authentication/authorizers/IdentityAuthorizer'
import { AnyAttempt, isValid } from './authentication/lib/Attempt'
import { BugButtonHandler } from './components/Button/BugButtonHandler'
import { ErrorBoundary } from './components/layout/ui/errors/error-boundary'
import { Modal, ModalRenderer } from './components/modal'
import { NetInfoAutoToast } from './components/toast/net-info-auto-toast'
import { nestProviders } from './helpers/provider'
import { pushNotifcationRegistration } from './push-notifications/push-notifications'
import { ToastProvider } from './hooks/use-toast'
import { DeprecateVersionModal } from './screens/deprecate-screen'
import { errorService } from './services/errors'
import { NetInfoDevOverlay } from './components/NetInfoDevOverlay'
import {
    ConfigProvider,
    largeDeviceMemory,
} from 'src/hooks/use-config-provider'
import { weatherHider } from './helpers/weather-hider'
import { loggingService } from './services/logging'
import ApolloClient from 'apollo-client'
import { pushDownloadFailsafe } from './helpers/push-download-failsafe'
import { prepareAndDownloadTodaysIssue } from './download-edition/prepare-and-download-issue'
import { remoteConfigService } from './services/remote-config'
import analytics from '@react-native-firebase/analytics'
import { crashlyticsService } from './services/crashlytics'
import { clearDownloadsDirectory } from './download-edition/clear-issues'
import { prepFileSystem } from './helpers/files'

analytics().setAnalyticsCollectionEnabled(false)

/**
 * Only one global Apollo client. As such, any update done from any component
 * will cause dependent views to refresh and keep up-to-date.
 */
const apolloClient = createApolloClient()

// Log Intitialisation
if (!__DEV__) {
    errorService.init(apolloClient)
}
loggingService.init(apolloClient)
remoteConfigService.init()

// --- SETUP OPERATIONS ---
// useScreens is not a hook
// eslint-disable-next-line react-hooks/rules-of-hooks
Platform.OS === 'ios' && enableScreens()
pushNotifcationRegistration(apolloClient)
prepFileSystem()
Platform.OS === 'android' && prepareAndDownloadTodaysIssue(apolloClient)

const styles = StyleSheet.create({
    appContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
})

const persistenceKey = 'dev-nav-key-232asfdffgdfg1asdffgfdgfdga3413'

const persistNavigationState = async (navState: any) => {
    try {
        await AsyncStorage.setItem(persistenceKey, JSON.stringify(navState))
    } catch (e) {
        console.log('Unable to persist state')
    }
}

const loadNavigationState = async () => {
    try {
        const jsonString = await AsyncStorage.getItem(persistenceKey)
        return jsonString && JSON.parse(jsonString)
    } catch (e) {
        console.log('Unable to load the navigation state')
    }
}

const rootNavigationProps = null && {
    persistNavigationState,
    loadNavigationState,
}

function getActiveRouteName(
    navigationState: NavigationState,
): ScreenTrackingMapping | null {
    if (!navigationState) {
        return null
    }
    const route = navigationState.routes[navigationState.index]
    // dive into nested navigators
    if (route.routes) {
        return getActiveRouteName(route as NavigationState)
    }
    return route.routeName as ScreenTrackingMapping
}

const onNavigationStateChange = (
    prevState: NavigationState,
    currentState: NavigationState,
) => {
    const prevScreen: ScreenTrackingMapping | null = getActiveRouteName(
        prevState,
    )
    const currentScreen: ScreenTrackingMapping | null = getActiveRouteName(
        currentState,
    )
    if (
        currentScreen &&
        ScreenTracking[currentScreen] &&
        currentScreen !== prevScreen
    ) {
        sendAppScreenEvent({
            screenName: ScreenTracking[currentScreen],
        })
    }
}

const isReactNavPersistenceError = (e: Error) =>
    __DEV__ && e.message.includes('There is no route defined for')

const WithProviders = nestProviders(
    Modal,
    ToastProvider,
    NavPositionProvider,
    ConfigProvider,
)

const handleIdStatus = (attempt: AnyAttempt<IdentityAuthData>) =>
    setUserId(isValid(attempt) ? attempt.data.userDetails.id : null)

const shouldHavePushFailsafe = async (client: ApolloClient<object>) => {
    const largeRAM = await largeDeviceMemory()
    if (largeRAM) {
        pushDownloadFailsafe(client)
    }
}

export default class App extends React.Component<{}, {}> {
    componentDidMount() {
        SplashScreen.hide()
        weatherHider(apolloClient)
        clearDownloadsDirectory()
        prepareAndDownloadTodaysIssue(apolloClient)
        shouldHavePushFailsafe(apolloClient)

        crashlyticsService.init()

        AppState.addEventListener('change', async appState => {
            if (appState === 'active') {
                prepareAndDownloadTodaysIssue(apolloClient)
            }
        })
    }

    async componentDidCatch(e: Error) {
        /**
         * use an heuristic to check whether this is a react-nav error
         * if it is then ditch our persistence and try to re-render
         */
        if (isReactNavPersistenceError(e)) {
            await AsyncStorage.removeItem(persistenceKey)
            this.forceUpdate()
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
                    <NetInfoDevOverlay>
                        <WithProviders>
                            <AccessProvider
                                onIdentityStatusChange={handleIdStatus}
                            >
                                <StatusBar
                                    barStyle="light-content"
                                    backgroundColor="#041f4a"
                                />
                                <View style={styles.appContainer}>
                                    <RootNavigator
                                        {...rootNavigationProps}
                                        enableURLHandling={__DEV__}
                                        onNavigationStateChange={
                                            onNavigationStateChange
                                        }
                                    />
                                    <NetInfoAutoToast />
                                </View>
                                <ModalRenderer />
                                <BugButtonHandler />
                                <DeprecateVersionModal />
                            </AccessProvider>
                        </WithProviders>
                    </NetInfoDevOverlay>
                </ApolloProvider>
            </ErrorBoundary>
        )
    }
}

/**
 * This needs to match what's found in your app_delegate.m and MainActivity.java.
 */

export const APP_NAME = 'Mallard'
