// Welcome to the main entry point of the app.
//
// In this file, we'll be kicking off our app or storybook.

import React from 'react'
import { useScreens } from 'react-native-screens'
import { StatusBar, View } from 'react-native'

import { RootNavigator } from './navigation'
import { SettingsProvider } from './hooks/use-settings'
import { FileSystemProvider } from './hooks/use-fs'

const navigationPersistenceKey = __DEV__ ? 'nav-1560178658543-' : null

export default class App extends React.Component<{}, {}> {
    /**
     * When the component is mounted. This happens asynchronously and simply
     * re-renders when we're good to go.
     */
    render() {
        return (
            <FileSystemProvider>
                <SettingsProvider>
                    <StatusBar
                        animated={true}
                        barStyle="light-content"
                        backgroundColor="#041f4a"
                    />
                    <View style={{ flex: 1, backgroundColor: '#000' }}>
                        <RootNavigator
                            persistenceKey={navigationPersistenceKey}
                        />
                    </View>
                </SettingsProvider>
            </FileSystemProvider>
        )
    }
}

/**
 * This needs to match what's found in your app_delegate.m and MainActivity.java.
 */

export const APP_NAME = 'Mallard'
