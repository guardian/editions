/**
 * @format
 */

import { AppRegistry } from 'react-native'
import App from './src/App'
import { name as appName } from './app.json'
import { Sentry, SentrySeverity } from 'react-native-sentry'
import Config from 'react-native-config'

const { SENTRY_DSN_URL } = Config

// See: https://docs.sentry.io/clients/react-native/config/
if (!__DEV__) {
Sentry.config(SENTRY_DSN_URL).install();
}

AppRegistry.registerComponent(appName, () => App)
