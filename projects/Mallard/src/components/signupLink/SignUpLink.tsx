import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
	createAccountLink: {
		textAlign: 'center',
		fontSize: 16,
		textDecorationStyle: 'solid',
		textDecorationLine: 'underline',
		color: '#007AFF',
		marginTop: 4,
	},
});

export const SignUpLink = () => (
	<TouchableOpacity
		onPress={() =>
			Linking.openURL(
				'https://support.theguardian.com/uk/subscribe/digital',
			)
		}
	>
		<Text style={styles.createAccountLink}>
			https://support.theguardian.com/uk/subscribe/digital
		</Text>
	</TouchableOpacity>
);
