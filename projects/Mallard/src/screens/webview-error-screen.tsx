import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SvgOfflineCloud } from 'src/components/icons/OfflineCloud';
import { color } from 'src/theme/color';
import { metrics } from 'src/theme/spacing';
import { getFont } from 'src/theme/typography';

const WebviewError = () => {
	const copy =
		"Sorry, we couldn't load this page. Please ensure you're online in order to view it.";
	return (
		<View style={styles.container}>
			<SvgOfflineCloud />

			<Text style={styles.text}>{copy}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 0.7,
		backgroundColor: '#F6F6F6',
		alignItems: 'center',
		justifyContent: 'center',
		marginHorizontal: metrics.horizontal,
	},
	text: {
		...getFont('sans', 0.9),
		width: '70%',
		color: color.text,
		textAlign: 'center',
	},
});
export default WebviewError;
