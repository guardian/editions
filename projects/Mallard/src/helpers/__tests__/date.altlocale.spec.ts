import { localDate } from '../date';

jest.mock('../locale', () => ({
	languageLocale: 'en-US',
}));

jest.mock('react-native/Libraries/Utilities/Platform', () => {
	const Platform = jest.requireActual(
		'react-native/Libraries/Utilities/Platform',
	);
	Platform.OS = 'android';
	return Platform;
});

describe('helpers/date', () => {
	describe('localDate', () => {
		it('should return a date in the correct format if US', () => {
			const date = new Date('2021-09-01T00:00:00.000Z');
			expect(localDate(date)).toBe('09/01/2021');
		});
	});
});
