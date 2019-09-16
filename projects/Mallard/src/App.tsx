// Welcome to the main entry point of the app.
//
// In this file, we'll be kicking off our app or storybook.

import AsyncStorage from '@react-native-community/async-storage'
import React from 'react'
import { StatusBar, StyleSheet, View } from 'react-native'
import { useScreens } from 'react-native-screens'
import { FileSystemProvider } from 'src/hooks/use-fs'
import { SettingsProvider } from 'src/hooks/use-settings'
import { RootNavigator } from 'src/navigation'
import { AuthProvider } from './authentication/auth-context'
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
import { AuthStatus, isIdentity } from './authentication/credentials-chain'
import { BugButton } from './components/BugButton'
import SplashScreen from 'react-native-splash-screen'

// useScreens is not a hook
// eslint-disable-next-line react-hooks/rules-of-hooks
useScreens()
prepFileSystem()
pushNotifcationRegistration()
clearOldIssues()
fetchCacheClear().then((weOk: boolean) => {
    if (weOk) {
        downloadTodaysIssue()
    }
})

const styles = StyleSheet.create({
    appContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
})

const persistenceKey = 'dev-nav-key-232asdf1asdfa3410'

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
    FileSystemProvider,
    SettingsProvider,
    Modal,
    ToastProvider,
)

const handleLoginStatus = (status: AuthStatus) => {
    if (isIdentity(status)) {
        setUserId(status.data.info.userDetails.id)
    } else {
        setUserId(null)
    }
}

export default class App extends React.Component<{}, {}> {
    componentDidMount() {
        SplashScreen.hide()
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
                    <AuthProvider onStatusChange={handleLoginStatus}>
                        <StatusBar
                            animated={true}
                            barStyle="light-content"
                            backgroundColor="#041f4a"
                        />
                        <View style={styles.appContainer}>
                            <RootNavigator
                                {...rootNavigationProps}
                                onNavigationStateChange={
                                    onNavigationStateChange
                                }
                            />
                            <NetInfoAutoToast />
                        </View>
                        <ModalRenderer />
                        <BugButton />
                    </AuthProvider>
                </WithProviders>
            </ErrorBoundary>
        )
    }
}

/**
 * This needs to match what's found in your app_delegate.m and MainActivity.java.
 */

export const APP_NAME = 'Mallard'
