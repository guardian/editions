import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { color } from 'src/theme/color';
import { getFont } from 'src/theme/typography';

const WebviewError = () => {
	const copy =
		'Sorry, you need to be online or have this issue downloaded to read this article. Please go online to try again.';
	return (
		<View style={styles.container}>
			<Text style={styles.text}>{copy}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	text: {
		...getFont('sans', 1),
		width: '70%',
		color: color.error,
		textAlign: 'center',
	},
});
export default WebviewError;
