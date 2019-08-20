/**
 * @format
 */

import { AppRegistry, YellowBox } from 'react-native';
import Config from 'react-native-config';
import { Sentry } from 'react-native-sentry';
import { name as appName } from './app.json';
import App from './src/App';

// Supress Could Not Find Image warnings as a result of our approach to find the image locally
YellowBox.ignoreWarnings(['Could not find image']);

const { SENTRY_DSN_URL } = Config

// See: https://docs.sentry.io/clients/react-native/config/
if (!__DEV__) {
Sentry.config(SENTRY_DSN_URL).install();
}

AppRegistry.registerComponent(appName, () => App)
