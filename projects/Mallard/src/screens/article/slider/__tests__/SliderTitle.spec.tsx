import { Dimensions } from 'react-native';
import { baseTests } from './SliderTitle-BaseTests';

jest.mock('react-native-device-info', () => ({
	isTablet: () => false,
}));

jest.spyOn(Dimensions, 'get').mockReturnValue({
	width: 700,
	height: 100,
	scale: 1,
	fontScale: 1,
});

baseTests('SliderTitle - iOS - Mobile');
