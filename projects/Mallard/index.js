import { AppRegistry, Text, YellowBox } from 'react-native';
import { name as appName } from './app.json';
import App from './src/App';

// In lieu of a wrapper component (i.e. <UnscaledText />), this quickly opts us out of scaled text globally.
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

// Supress Could Not Find Image warnings as a result of our approach to find the image locally
YellowBox.ignoreWarnings([]);

AppRegistry.registerComponent(appName, () => App);
