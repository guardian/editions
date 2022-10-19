import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { sendComponentEvent, ComponentType, Action } from 'src/services/ophan';

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

export const SignUpLink = ({ onPress }: { onPress: () => void }) => (
	<TouchableOpacity
		onPress={() => {
			sendComponentEvent({
				componentType: ComponentType.AppButton,
				action: Action.Click,
				value: 'subscription_website_clicked',
			});
			onPress();
		}}
	>
		<Text style={styles.createAccountLink}>
			https://support.theguardian.com/uk/subscribe/digital
		</Text>
	</TouchableOpacity>
);
