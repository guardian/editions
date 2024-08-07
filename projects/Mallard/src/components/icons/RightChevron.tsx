import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useAppAppearance } from '../../theme/appearance';
import { getFont } from '../../theme/typography';

const RightChevron = () => {
	const styles = StyleSheet.create({
		icon: {
			...getFont('icon', 1),
			color: useAppAppearance().color,
		},
	});

	return <Text style={styles.icon}>{'\uE00B'}</Text>;
};

export { RightChevron };
