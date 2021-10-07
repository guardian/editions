jest.mock('@gorhom/bottom-sheet', () => {
	const react = require('react-native');
	return {
		__esModule: true,
		default: react.View,
		BottomSheetScrollView: react.ScrollView,
	};
});
