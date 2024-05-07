import React from 'react';
import { copy } from '../helpers/words';
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
		title={copy.subNotFound.title}
		appearance={CardAppearance.Blue}
		size="small"
		explainerTitle={copy.subNotFound.explainer}
		onDismissThisCard={() => {
			close();
			onDismiss();
		}}
		explainerSubtitle={copy.subNotFound.explainerSubtitle}
		bottomContent={
			<>
				<ModalButton onPress={onLoginPress}>
					{copy.subNotFound.signIn}
				</ModalButton>
				<ModalButton
					onPress={() => {
						close();
						onOpenCASLogin();
					}}
				>
					{copy.subNotFound.subscriberButton}
				</ModalButton>
			</>
		}
	></OnboardingCard>
);

export { SubNotFoundModalCard };
