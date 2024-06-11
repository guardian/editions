import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import type { MainStackParamList } from 'src/navigation/NavigationModels';
import { color } from 'src/theme/color';
import { metrics } from 'src/theme/spacing';
import { Chevron } from '../../chevron';

const styles = StyleSheet.create({
	headerContainer: {
		height: metrics.headerHeight,
		zIndex: 90,
		alignContent: 'stretch',
		justifyContent: 'center',
		backgroundColor: color.background,
		borderColor: color.line,
		borderTopWidth: StyleSheet.hairlineWidth,
		borderBottomWidth: StyleSheet.hairlineWidth,
	},
	headerChevronContainer: {
		flex: 1,
		width: '100%',
		paddingHorizontal: metrics.horizontal,
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 20,
	},
});

const Header = () => {
	const navigation =
		useNavigation<NativeStackNavigationProp<MainStackParamList>>();
	return (
		<View style={styles.headerContainer}>
			<TouchableWithoutFeedback
				onPress={navigation.goBack}
				accessibilityHint="Go back"
			>
				<View style={styles.headerChevronContainer}>
					<Chevron color={color.text} />
				</View>
			</TouchableWithoutFeedback>
		</View>
	);
};

export { Header };
