import React from 'react';
import type { TextProps } from 'react-native';
import { StyleSheet, Text } from 'react-native';
import { color } from '../theme/color';

const styles = StyleSheet.create({
	link: {
		color: color.primary,
		textDecorationLine: 'underline',
	},
});

const LinkNav = ({
	children,
	style,
	onPress,
}: {
	children: string;
	style?: TextProps['style'];
	onPress: () => void;
}) => (
	<Text style={[styles.link, style]} onPress={onPress}>
		{children}
	</Text>
);

export { LinkNav };
