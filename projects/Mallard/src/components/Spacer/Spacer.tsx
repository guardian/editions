import React from 'react';
import { StyleSheet, View } from 'react-native';

const styles = (unit: number) =>
	StyleSheet.create({
		spacer: {
			marginRight: unit,
			marginTop: unit,
		},
	});
export const Spacer = ({ unit = 8 }: { unit?: number }) => (
	<View style={styles(unit).spacer} />
);
