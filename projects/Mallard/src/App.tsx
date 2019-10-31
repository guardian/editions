// Welcome to the main entry point of the app.
//
// In this file, we'll be kicking off our app or storybook.

import AsyncStorage from '@react-native-community/async-storage'
import React from 'react'
import { AppState, StatusBar, StyleSheet, View, Platform } from 'react-native'
import { useScreens } from 'react-native-screens'
import { SettingsProvider } from 'src/hooks/use-settings'
import { RootNavigator } from 'src/navigation'
import { ErrorBoundary } from './components/layout/ui/errors/error-boundary'
import { Modal, ModalRenderer } from './components/modal'
import { NetInfoAutoToast } from './components/toast/net-info-auto-toast'
import { ToastProvider } from './hooks/use-toast'
import {
    prepFileSystem,
    clearOldIssues,
    downloadTodaysIssue,
} from './helpers/files'
import { nestProviders } from './helpers/provider'
import { pushNotifcationRegistration } from './helpers/push-notifications'
import { fetchCacheClear } from './helpers/fetch'
import {
    sendAppScreenEvent,
    ScreenTracking,
    ScreenTrackingMapping,
    setUserId,
} from 'src/services/ophan'
import { NavigationState } from 'react-navigation'
import { BugButton } from './components/BugButton'
import SplashScreen from 'react-native-splash-screen'
import { UpdateIpAddress } from './components/update-ip-address'
import { NetInfoProvider } from './hooks/use-net-info'
import { DeprecateVersionModal } from './screens/deprecate-screen'
import { AccessProvider } from './authentication/AccessContext'
import { AnyAttempt, isValid } from './authentication/lib/Attempt'
import { IdentityAuthData } from './authentication/authorizers/IdentityAuthorizer'
import { IssueSummaryProvider } from './hooks/use-issue-summary'

const clearAndDownloadIssue = async () => {
    await prepFileSystem()
    await clearOldIssues()
    const weOk = await fetchCacheClear()
    if (weOk) {
        downloadTodaysIssue()
    }
}

// useScreens is not a hook
// eslint-disable-next-line react-hooks/rules-of-hooks
useScreens()
pushNotifcationRegistration()
Platform.OS === 'android' && clearAndDownloadIssue()

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

const rootNavigationProps = __DEV__ && {
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
    SettingsProvider,
    Modal,
    ToastProvider,
    NetInfoProvider,
    IssueSummaryProvider,
)

const handleIdStatus = (attempt: AnyAttempt<IdentityAuthData>) =>
    setUserId(isValid(attempt) ? attempt.data.userDetails.id : null)

export default class App extends React.Component<{}, {}> {
    componentDidMount() {
        SplashScreen.hide()

        AppState.addEventListener('change', async appState => {
            if (appState === 'active') {
                clearAndDownloadIssue()
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
                <WithProviders>
                    <AccessProvider onIdentityStatusChange={handleIdStatus}>
                        <StatusBar
                            animated={true}
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
                            <UpdateIpAddress />
                        </View>
                        <ModalRenderer />
                        <BugButton />
                        <DeprecateVersionModal />
                    </AccessProvider>
                </WithProviders>
            </ErrorBoundary>
        )
    }
}

/**
 * This needs to match what's found in your app_delegate.m and MainActivity.java.
 */

export const APP_NAME = 'Mallard'
