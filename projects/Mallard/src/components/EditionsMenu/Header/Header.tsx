import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TitlepieceText } from 'src/components/styled-text';
import { color } from 'src/theme/color';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginBottom: 4,
	},
	shadowBox: {
		backgroundColor: 'white',
		paddingBottom: 38,
		paddingLeft: 96,
		paddingTop: 4,
		shadowColor: color.palette.neutral[7],
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	text: { fontSize: 24, lineHeight: 30 },
});

const EditionsMenuHeader = ({ children }: { children: string }) => (
	<View style={styles.container}>
		<View style={styles.shadowBox}>
			<TitlepieceText style={styles.text}>{children}</TitlepieceText>
		</View>
	</View>
);

export { EditionsMenuHeader };
