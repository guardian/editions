import React from 'react';
import { StyleSheet, View } from 'react-native';
import { copy } from 'src/helpers/words';
import { metrics } from 'src/theme/spacing';
import { ModalButton } from './Button/ModalButton';
import { CardAppearance, OnboardingCard } from './onboarding/onboarding-card';
import { UiBodyCopy } from './styled-text';

const styles = StyleSheet.create({
	bottomContentContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginTop: metrics.vertical * 2,
	},
});

const SignInFailedModalCard = ({
	close,
	onLoginPress,
	onOpenCASLogin,
	onDismiss,
	email,
}: {
	close: () => void;
	onLoginPress: () => void;
	onOpenCASLogin: () => void;
	onDismiss: () => void;
	email: string;
}) => (
	<OnboardingCard
		title={copy.failedSignIn.title}
		appearance={CardAppearance.Blue}
		onDismissThisCard={() => {
			close();
			onDismiss();
		}}
		size="small"
		bottomContent={
			<>
				<UiBodyCopy weight="bold">
					{copy.failedSignIn.body.replace('%email%', email)}
				</UiBodyCopy>
				<View style={styles.bottomContentContainer}>
					<View>
						<ModalButton
							onPress={() => {
								close();
								onLoginPress();
							}}
						>
							{copy.failedSignIn.retryButtonTitle}
						</ModalButton>
						<ModalButton
							onPress={() => {
								close();
								onOpenCASLogin();
							}}
						>
							Activate with subscriber ID
						</ModalButton>
					</View>
				</View>
			</>
		}
	/>
);

export { SignInFailedModalCard };
