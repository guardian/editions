import React from 'react';
import { Copy } from 'src/helpers/words';
import { RouteNames } from 'src/navigation/NavigationModels';
import { sendComponentEvent, ComponentType, Action } from 'src/services/ophan';
import { ModalButton } from './Button/ModalButton';
import { CardAppearance, OnboardingCard } from './onboarding/onboarding-card';
import { SignUpLink } from './signupLink/SignUpLink';

const SubNotFoundModalCard = ({
	close,
	onOpenCASLogin,
	onLoginPress,
	onDismiss,
	navigation,
}: {
	close: () => void;
	onOpenCASLogin: () => void;
	onLoginPress: () => void;
	onDismiss: () => void;
	navigation: any;
}) => (
	<OnboardingCard
		title={Copy.subNotFound.title}
		appearance={CardAppearance.Blue}
		size="small"
		explainerTitle={Copy.subNotFound.explainer}
		onDismissThisCard={() => {
			close();
			onDismiss();
		}}
		explainerSubtitle={Copy.subNotFound.explainerSubtitle}
		bottomContent={
			<>
				<ModalButton
					onPress={() => {
						close();
						onLoginPress();
					}}
				>
					{Copy.subNotFound.signIn}
				</ModalButton>
				<ModalButton
					onPress={() => {
						close();
						onOpenCASLogin();
					}}
				>
					{Copy.subNotFound.subscriberButton}
				</ModalButton>
			</>
		}
		bottomExplainerContent={
			<SignUpLink
				onPress={() => {
					close();
					navigation.navigate(RouteNames.ExternalSubscription);
				}}
			/>
		}
	></OnboardingCard>
);

export { SubNotFoundModalCard };
