// Welcome to the main entry point of the app.
//
// In this file, we'll be kicking off our app or storybook.

import React from 'react'
import { StatusBar } from 'react-native'
import { RootNavigator } from './navigation'
import { SettingsProvider } from './hooks/use-settings'

const navigationPersistenceKey = __DEV__ ? 'Navigation-State-DEV-' : null

export default class App extends React.Component<{}, {}> {
    /**
     * When the component is mounted. This happens asynchronously and simply
     * re-renders when we're good to go.
     */
    render() {
        return (
            <SettingsProvider>
                <StatusBar
                    animated={true}
                    barStyle="light-content"
                    backgroundColor="#041f4a"
                />
                <RootNavigator persistenceKey={navigationPersistenceKey} />
            </SettingsProvider>
        )
    }
}

/**
 * This needs to match what's found in your app_delegate.m and MainActivity.java.
 */
const APP_NAME = 'Mallard'
