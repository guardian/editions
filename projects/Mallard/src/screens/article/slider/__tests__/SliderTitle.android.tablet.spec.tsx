import { baseTests } from './SliderTitle-BaseTests'

jest.mock('react-native-device-info', () => ({
    isTablet: () => true,
}))

jest.mock('react-native/Libraries/Utilities/Dimensions', () => {
    const Dimensions = {
        get: anything => {
            return { width: 700, height: 100 }
        },
    }
    return Dimensions
})

jest.mock('react-native/Libraries/Utilities/Platform', () => {
    const Platform = require.requireActual(
        'react-native/Libraries/Utilities/Platform',
    )
    Platform.OS = 'android'
    return Platform
})

baseTests('SliderTitle - Android - Tablet')
