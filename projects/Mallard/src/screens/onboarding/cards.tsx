import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ButtonAppearance } from '../../components/Button/Button';
import { ModalButton } from '../../components/Button/ModalButton';
import { LinkNav } from '../../components/link';
import {
	CardAppearance,
	OnboardingCard,
} from '../../components/onboarding/onboarding-card';
import { copy, PREFS_SAVED_MSG } from '../../helpers/words';
import { useGdprSettings } from '../../hooks/use-gdpr';
import { useToast } from '../../hooks/use-toast';
import type { MainStackParamList } from '../../navigation/NavigationModels';
import { RouteNames } from '../../navigation/NavigationModels';

const Aligner = ({ children }: { children: React.ReactNode }) => (
	<View
		style={{
			flexDirection: 'column',
			flex: 1,
			alignItems: 'stretch',
			justifyContent: 'center',
		}}
	>
		{children}
	</View>
);

const styles = StyleSheet.create({
	consentButtonContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
});

const OnboardingConsent = () => {
	const navigation =
		useNavigation<NativeStackNavigationProp<MainStackParamList>>();
	const { enableAllSettings } = useGdprSettings();
	const { showToast } = useToast();

	return (
		<Aligner>
			<OnboardingCard
				appearance={CardAppearance.Blue}
				title={copy.consentOnboarding.title}
				explainerTitle={copy.consentOnboarding.explainerTitle}
				bottomExplainerContent={
					<>
						<View style={styles.consentButtonContainer}>
							<View>
								<ModalButton
									onPress={() => {
										navigation.navigate(
											RouteNames.OnboardingConsentInline,
										);
									}}
									buttonAppearance={
										ButtonAppearance.SkeletonBlue
									}
								>
									{copy.consentOnboarding.optionsButton}
								</ModalButton>
							</View>
							<View>
								<ModalButton
									onPress={() => {
										enableAllSettings();
										showToast(PREFS_SAVED_MSG);
										navigation.navigate(RouteNames.Issue);
									}}
									buttonAppearance={ButtonAppearance.Dark}
								>
									{copy.consentOnboarding.okayButton}
								</ModalButton>
							</View>
						</View>
					</>
				}
			>
				{
					<>
						The only data that is collected (through tracking
						technology) is used by the Guardian to improve your
						experience and our level of service to you. By
						continuing, you agree with the Guardian&apos;s{' '}
						<LinkNav
							onPress={() => {
								navigation.navigate(
									RouteNames.PrivacyPolicyInline,
								);
							}}
						>
							privacy policy
						</LinkNav>
						.
					</>
				}
			</OnboardingCard>
		</Aligner>
	);
};

export { OnboardingConsent };
