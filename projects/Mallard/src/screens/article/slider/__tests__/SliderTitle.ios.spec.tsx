import { baseTests } from './SliderTitle-BaseTests'

jest.mock('react-native-device-info', () => ({
    isTablet: () => false,
}))

baseTests('SliderTitle - iOS - Mobile')
