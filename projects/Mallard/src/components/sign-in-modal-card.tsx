import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Copy } from 'src/helpers/words';
import { Action, ComponentType, sendComponentEvent } from 'src/services/ophan';
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
			title={Copy.signIn.title}
			subtitle={Copy.signIn.subtitle}
			appearance={CardAppearance.Blue}
			size="medium"
			bottomContent={
				<>
					<View style={styles.bottomContentContainer}>
						<ModalButton
							onPress={() => {
								close();
								onLoginPress();
								sendComponentEvent({
									componentType: ComponentType.AppButton,
									action: Action.Click,
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
