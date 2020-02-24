import { baseTests } from './SliderTitle-BaseTests'

jest.mock('react-native-device-info', () => ({
    isTablet: () => true,
}))

baseTests('SliderTitle - iOS - Tablet')
