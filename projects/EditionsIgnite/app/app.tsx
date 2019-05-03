// Welcome to the main entry point of the app.
//
// In this file, we'll be kicking off our app or storybook.

import "./i18n"
import * as React from "react"
import { AppRegistry, StatusBar } from "react-native"
import { RootNavigator } from "./navigation"
import { StorybookUIRoot } from "../storybook"

const navigationPersistenceKey = __DEV__ ? "NavigationStateDEV" : null

export class App extends React.Component<{}, {}> {
  /**
   * When the component is mounted. This happens asynchronously and simply
   * re-renders when we're good to go.
   */
  render() {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="#041f4a" />
        <RootNavigator persistenceKey={navigationPersistenceKey} />
      </>
    )
  }
}

/**
 * This needs to match what's found in your app_delegate.m and MainActivity.java.
 */
const APP_NAME = "EditionsIgnite"

// Should we show storybook instead of our app?
//
// ⚠️ Leave this as `false` when checking into git.
const SHOW_STORYBOOK = false

const RootComponent = SHOW_STORYBOOK && __DEV__ ? StorybookUIRoot : App
AppRegistry.registerComponent(APP_NAME, () => RootComponent)
