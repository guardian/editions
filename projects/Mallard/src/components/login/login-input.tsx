import React from 'react';
import type { TextInputProps } from 'react-native';
import {
	Keyboard,
	TextInput as RNTextInput,
	StyleSheet,
	View,
} from 'react-native';
import { color } from '../../theme/color';
import { metrics } from '../../theme/spacing';
import { getFont } from '../../theme/typography';
import { UiBodyCopy } from '../styled-text';

const loginInputStyles = StyleSheet.create({
	container: { marginBottom: metrics.vertical * 2 },
	label: {
		color: color.primary,
		marginBottom: metrics.vertical,
	},
	input: {
		paddingVertical: metrics.vertical,
		paddingHorizontal: metrics.horizontal,
		borderWidth: 1,
	},
	error: {
		color: color.error,
		marginTop: metrics.vertical,
	},
});

interface LoginInputProps {
	secureTextEntry?: boolean;
	label: string;
	accessibilityLabel: string;
	textContentType?: TextInputProps['textContentType'];
	keyboardType?: TextInputProps['keyboardType'];
	editable?: TextInputProps['editable'];
	value: TextInputProps['value'];
	onChangeText: TextInputProps['onChangeText'];
	error: string | null;
}

const LoginInput = ({
	secureTextEntry,
	label,
	accessibilityLabel,
	textContentType,
	keyboardType,
	editable = true,
	value,
	onChangeText,
	error,
}: LoginInputProps) => (
	<View style={loginInputStyles.container}>
		<UiBodyCopy weight="bold" style={loginInputStyles.label}>
			{label}
		</UiBodyCopy>
		<View>
			<RNTextInput
				style={[
					loginInputStyles.input,
					{
						borderColor: error ? color.error : color.primary,
						color: editable ? color.text : color.dimText,
						...getFont('sans', 1),
					},
				]}
				accessibilityLabel={accessibilityLabel}
				textContentType={textContentType}
				secureTextEntry={secureTextEntry}
				onSubmitEditing={Keyboard.dismiss}
				returnKeyType="done"
				placeholderTextColor="grey"
				editable={editable}
				autoCorrect={false}
				autoCapitalize="none"
				keyboardType={keyboardType}
				value={value}
				onChangeText={onChangeText}
			/>
		</View>
		{error && (
			<UiBodyCopy style={loginInputStyles.error}>{error}</UiBodyCopy>
		)}
	</View>
);

export { LoginInput };
