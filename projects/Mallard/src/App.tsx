// Welcome to the main entry point of the app.
//
// In this file, we'll be kicking off our app or storybook.

import React from 'react'
import { useScreens } from 'react-native-screens'
import { StatusBar, View } from 'react-native'

import { RootNavigator } from 'src/navigation'
import { SettingsProvider } from 'src/hooks/use-settings'
import { FileSystemProvider } from 'src/hooks/use-fs'
import { StyleSheet } from 'react-native'
import { ErrorBoundary } from './components/layout/ui/errors/error-boundary'
import { prepFileSystem } from './helpers/files'
import AsyncStorage from "@react-native-community/async-storage";

useScreens()
prepFileSystem()

const styles = StyleSheet.create({
    appContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
})

const persistenceKey = "nav-"
const persistNavigationState = async (navState: any) => {
  try {
    await AsyncStorage.setItem(persistenceKey, JSON.stringify(navState))
  } catch(e) {
    console.log('Unable to persist state')
  }
}

const loadNavigationState = async () => {
    try {
        const jsonString = await AsyncStorage.getItem(persistenceKey)
        return jsonString && JSON.parse(jsonString);
    } catch(e) {
        console.log('Unable to load the navigation state');
    }
}

export default class App extends React.Component<{}, {}> {
    /**
     * When the component is mounted. This happens asynchronously and simply
     * re-renders when we're good to go.
     */
    render() {
        return (
            <ErrorBoundary>
                <FileSystemProvider>
                    <SettingsProvider>
                        <StatusBar
                            animated={true}
                            barStyle="light-content"
                            backgroundColor="#041f4a"
                        />
                        <View style={styles.appContainer}>
                            <RootNavigator
                                persistNavigationState={persistNavigationState}
                                loadNavigationState={loadNavigationState}
                            />
                        </View>
                    </SettingsProvider>
                </FileSystemProvider>
            </ErrorBoundary>
        )
    }
}

/**
 * This needs to match what's found in your app_delegate.m and MainActivity.java.
 */

export const APP_NAME = 'Mallard'
