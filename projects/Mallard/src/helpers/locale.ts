import { NativeModules, Platform } from 'react-native'
import * as RNLocalize from 'react-native-localize'

const locale =
    Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
          NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
        : NativeModules.I18nManager.localeIdentifier

const usesMetricTemperature = (): boolean => {
    return RNLocalize.getTemperatureUnit() === 'celsius'
}

export { locale, usesMetricTemperature }
