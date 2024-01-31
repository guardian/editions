jest.mock('react-native-reanimated', () => {
	const reanimated = require('react-native-reanimated/mock');
	return reanimated;
});
