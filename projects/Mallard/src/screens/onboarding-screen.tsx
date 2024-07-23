import type { ReactNode } from 'react';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { color } from '../theme/color';
import { metrics } from '../theme/spacing';
import { OnboardingConsent } from './onboarding/cards';

const styles = StyleSheet.create({
	background: {
		backgroundColor: color.palette.neutral[93],
		flex: 1,
		display: 'flex',
		justifyContent: 'center',
	},
	padding: {
		display: 'flex',
		flex: 1,
		alignItems: 'center',
		padding: metrics.horizontal * 2,
	},
});

const Frame = ({ children }: { children: ReactNode }) => (
	<SafeAreaView style={styles.background}>
		<View style={styles.padding}>{children}</View>
	</SafeAreaView>
);

const OnboardingConsentScreen = () => {
	return (
		<Frame>
			<OnboardingConsent />
		</Frame>
	);
};

export { OnboardingConsentScreen };
