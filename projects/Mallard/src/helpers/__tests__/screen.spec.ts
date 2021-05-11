import {
	convertImageSizeToImageDescription,
	screenSizeToImageSize,
} from '../screen';

describe('helpers/screen', () => {
	describe('screenSizeToImageSize', () => {
		it('should provide the minimum value if the screen size is less than that value', () => {
			expect(screenSizeToImageSize(320)).toEqual(375);
		});

		it('should provide the minimum value if the screen size is equal to that value', () => {
			expect(screenSizeToImageSize(375)).toEqual(375);
		});

		it('should return the max possible value if the screen size is greater than that value', () => {
			expect(screenSizeToImageSize(1366)).toEqual(1140);
		});

		it('should return the max possible value if it equals that value', () => {
			expect(screenSizeToImageSize(1140)).toEqual(1140);
		});

		it('should return a middle value that is the bracket greater than the screen size provided', () => {
			expect(screenSizeToImageSize(900)).toEqual(980);
		});
	});

	describe('convertImageSizeToImageDescription', () => {
		it('should return "phone" if no screen size is provided', () => {
			expect(convertImageSizeToImageDescription(NaN)).toEqual('phone');
		});
		it('should return "phone" if an incorrect screen size is provided', () => {
			expect(convertImageSizeToImageDescription(-100)).toEqual('phone');
		});

		it('should return "phone" if a middling value is provided', () => {
			expect(convertImageSizeToImageDescription(1000)).toEqual('phone');
		});

		it('should return a correct size based on the value', () => {
			expect(convertImageSizeToImageDescription(980)).toEqual('tabletL');
		});
	});
});
