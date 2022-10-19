import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Copy } from 'src/helpers/words';
import {
	CompositeNavigationStackProps,
	RouteNames,
} from 'src/navigation/NavigationModels';
import { Action, ComponentType, sendComponentEvent } from 'src/services/ophan';
import { color } from 'src/theme/color';
import { getFont } from 'src/theme/typography';
import { ButtonAppearance } from './Button/Button';
import { ModalButton } from './Button/ModalButton';
import { CardAppearance, OnboardingCard } from './onboarding/onboarding-card';
import { SignUpLink } from './signupLink/SignUpLink';
import { TitlepieceText } from './styled-text';

const styles = StyleSheet.create({
	bottomContentContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		flexGrow: 1,
		marginRight: 15,
	},
	createAccountContainer: {
		marginBottom: 20,
		marginTop: 30,
	},
	createAccountTitle: {
		...getFont('titlepiece', 2.25),
		marginBottom: 8,
		color: color.ui.shark,
	},
});

const SignInModalCard = ({
	close,
	onLoginPress,
	onDismiss,
	navigation,
}: {
	close: () => void;
	onLoginPress: () => void;
	onDismiss: () => void;
	navigation: any;
}) => {
	return (
		<OnboardingCard
			onDismissThisCard={onDismiss}
			title={Copy.signIn.title}
			subtitle={Copy.signIn.subtitle}
			appearance={CardAppearance.White}
			size="medium"
			bottomContent={
				<>
					<View style={styles.bottomContentContainer}>
						<ModalButton
							buttonAppearance={ButtonAppearance.Skeleton}
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
					<View style={styles.createAccountContainer}>
						<TitlepieceText
							accessibilityRole="header"
							style={styles.createAccountTitle}
						>
							Create an account
						</TitlepieceText>
						<SignUpLink
							onPress={() => {
								close();
								navigation.navigate(
									RouteNames.ExternalSubscription,
								);
							}}
						/>
					</View>
				</>
			}
		/>
	);
};

export { SignInModalCard };
