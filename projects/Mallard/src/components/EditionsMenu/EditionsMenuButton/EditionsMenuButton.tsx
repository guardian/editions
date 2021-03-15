import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Editions } from 'src/components/icons/Editions';
import { LeftChevron } from 'src/components/icons/LeftChevron';
import { color } from 'src/theme/color';

const styles = (selected: boolean) =>
	StyleSheet.create({
		button: {
			alignItems: 'center',
			backgroundColor: selected
				? color.palette.sport.pastel
				: 'transparent',
			borderRadius: 24,
			justifyContent: 'center',
			height: 42,
			width: 42,
		},
	});

const EditionsMenuButton = ({
	onPress,
	selected = false,
}: {
	onPress: () => void;
	selected?: boolean;
}) => (
	<TouchableOpacity
		accessibilityRole="button"
		accessibilityLabel="Regions and specials editions menu"
		onPress={onPress}
		style={styles(selected).button}
	>
		{selected ? <LeftChevron /> : <Editions />}
	</TouchableOpacity>
);

export { EditionsMenuButton };
