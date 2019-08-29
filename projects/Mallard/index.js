import { AppRegistry, YellowBox } from 'react-native'
import { name as appName } from './app.json'
import App from './src/App'
import { errorService } from 'src/services/errors.js'

// Supress Could Not Find Image warnings as a result of our approach to find the image locally
YellowBox.ignoreWarnings(['Could not find image'])

if (!__DEV__) {
    errorService.init()
}

AppRegistry.registerComponent(appName, () => App)
