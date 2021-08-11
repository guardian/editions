import React from 'react';
import { Copy } from 'src/helpers/words';
import { ModalButton } from './Button/ModalButton';
import { CardAppearance, OnboardingCard } from './onboarding/onboarding-card';

const SubNotFoundModalCard = ({
	close,
	onOpenCASLogin,
	onLoginPress,
	onDismiss,
}: {
	close: () => void;
	onOpenCASLogin: () => void;
	onLoginPress: () => void;
	onDismiss: () => void;
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
	></OnboardingCard>
);

export { SubNotFoundModalCard };
