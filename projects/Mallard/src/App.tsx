// Welcome to the main entry point of the app.
//
// In this file, we'll be kicking off our app or storybook.

import React, { useState, createContext } from 'react'
import { AppRegistry, StatusBar } from 'react-native'
import { RootNavigator } from './navigation'
import { StateProvider } from './helpers/state'

const navigationPersistenceKey = __DEV__ ? 'NavigationStateDEV' : null

export default class App extends React.Component<{}, {}> {
    /**
     * When the component is mounted. This happens asynchronously and simply
     * re-renders when we're good to go.
     */
    render() {
        return (
            <StateProvider>
                <StatusBar barStyle="light-content" backgroundColor="#041f4a" />
                <RootNavigator persistenceKey={navigationPersistenceKey} />
            </StateProvider>
        )
    }
}

/**
 * This needs to match what's found in your app_delegate.m and MainActivity.java.
 */
const APP_NAME = 'Mallard'
