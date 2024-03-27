import React from 'react';
import { StyleSheet, View } from 'react-native';
import { logEvent } from 'src/helpers/analytics';
import { copy } from 'src/helpers/words';
import { ModalButton } from './Button/ModalButton';
import { CardAppearance, OnboardingCard } from './onboarding/onboarding-card';

const styles = StyleSheet.create({
	bottomContentContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		flexGrow: 1,
		marginRight: 15,
	},
});

const SignInModalCard = ({
	close,
	onLoginPress,
	onDismiss,
}: {
	close: () => void;
	onLoginPress: () => void;
	onDismiss: () => void;
}) => {
	return (
		<OnboardingCard
			onDismissThisCard={onDismiss}
			title={copy.signIn.title}
			subtitle={copy.signIn.subtitle}
			appearance={CardAppearance.Blue}
			size="medium"
			bottomContent={
				<>
					<View style={styles.bottomContentContainer}>
						<ModalButton
							onPress={() => {
								close();
								onLoginPress();
								logEvent({
									name: 'sign_in_continue',
									value: 'sign_in_continue_clicked',
								});
							}}
						>
							Sign in
						</ModalButton>
					</View>
				</>
			}
		/>
	);
};

export { SignInModalCard };
