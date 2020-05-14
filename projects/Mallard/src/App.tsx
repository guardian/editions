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
import { clearAndDownloadIssue } from 'src/helpers/clear-download-issue'
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
import { BugButton } from './components/BugButton'
import { ErrorBoundary } from './components/layout/ui/errors/error-boundary'
import { Modal, ModalRenderer } from './components/modal'
import { NetInfoAutoToast } from './components/toast/net-info-auto-toast'
import { nestProviders } from './helpers/provider'
import { pushNotifcationRegistration } from './helpers/push-notifications'
import { ToastProvider } from './hooks/use-toast'
import { DeprecateVersionModal } from './screens/deprecate-screen'
import { errorService } from './services/errors'
import { NetInfoDevOverlay } from './components/NetInfoDevOverlay'
import { ConfigProvider } from 'src/hooks/use-config-provider'
import { Lightbox } from './screens/lightbox'
import { LightboxProvider } from './screens/use-lightbox-modal'
import { weatherHider } from './helpers/weather-hider'
import { loggingService } from './services/logging'

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

// useScreens is not a hook
// eslint-disable-next-line react-hooks/rules-of-hooks
Platform.OS === 'ios' && enableScreens()
pushNotifcationRegistration(apolloClient)
Platform.OS === 'android' && clearAndDownloadIssue(apolloClient)

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
    LightboxProvider,
)

const handleIdStatus = (attempt: AnyAttempt<IdentityAuthData>) =>
    setUserId(isValid(attempt) ? attempt.data.userDetails.id : null)

export default class App extends React.Component<{}, {}> {
    componentDidMount() {
        SplashScreen.hide()
        weatherHider(apolloClient)
        clearAndDownloadIssue(apolloClient)

        AppState.addEventListener('change', async appState => {
            if (appState === 'active') {
                clearAndDownloadIssue(apolloClient)
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
                                <BugButton />
                                <DeprecateVersionModal />
                                <Lightbox />
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
