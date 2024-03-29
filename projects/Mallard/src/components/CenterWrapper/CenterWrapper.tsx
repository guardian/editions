import React from 'react';
import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
	centerWrapper: {
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
	},
});

const CenterWrapper: React.FC<React.PropsWithChildren<Element>> = ({
	children,
}) => <View style={styles.centerWrapper}>{children}</View>;

export { CenterWrapper };
