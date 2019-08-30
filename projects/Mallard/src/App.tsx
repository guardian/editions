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
import { Modal } from './components/modal'
import { NetInfoAutoToast } from './components/toast/net-info-auto-toast'
import { ToastProvider } from './hooks/use-toast'
import {
    prepFileSystem,
    clearOldIssues,
    downloadTodaysIssue,
} from './helpers/files'
import { nestProviders } from './helpers/provider'
import { pushNotifcationRegistration } from './helpers/push-notifications'

// useScreens is not a hook
// eslint-disable-next-line react-hooks/rules-of-hooks
useScreens()
prepFileSystem()
pushNotifcationRegistration()
clearOldIssues()
downloadTodaysIssue()

const styles = StyleSheet.create({
    appContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
})

const persistenceKey = 'dev-nav-key-232asdf1asdfa342'
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

const isReactNavPersistenceError = (e: Error) =>
    __DEV__ && e.message.includes('There is no route defined for')

const WithProviders = nestProviders(
    FileSystemProvider,
    SettingsProvider,
    Modal,
    ToastProvider,
    AuthProvider,
)

export default class App extends React.Component<{}, {}> {
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
                    <StatusBar
                        animated={true}
                        barStyle="light-content"
                        backgroundColor="#041f4a"
                    />
                    <View style={styles.appContainer}>
                        <RootNavigator {...rootNavigationProps} />
                        <NetInfoAutoToast />
                    </View>
                </WithProviders>
            </ErrorBoundary>
        )
    }
}

/**
 * This needs to match what's found in your app_delegate.m and MainActivity.java.
 */

export const APP_NAME = 'Mallard'
