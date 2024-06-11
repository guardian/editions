import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Spinner } from 'src/components/Spinner/Spinner';

const styles = StyleSheet.create({
	loadingScreen: {
		height: Dimensions.get('window').height,
		width: Dimensions.get('window').width,
		backgroundColor: 'white',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

const LoadingScreen = () => (
	<View style={styles.loadingScreen}>
		<Spinner />
	</View>
);

export { LoadingScreen };
