import { NativeModules } from 'react-native'

export const isInTestFlight = () =>
    NativeModules.RNReleaseStream.getReleaseStream === 'TESTFLIGHT'
