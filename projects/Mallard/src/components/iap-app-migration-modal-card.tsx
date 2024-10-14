import React from 'react';
import { copy } from '../helpers/words';
import { CardAppearance, OnboardingCard } from './onboarding/onboarding-card';
import { UiBodyCopy } from './styled-text';

const IAPAppMigrationModalCard = ({ onDismiss }: { onDismiss: () => void }) => {
	return (
		<OnboardingCard
			onDismissThisCard={onDismiss}
			title={copy.iAPMigration.title}
			appearance={CardAppearance.Apricot}
			size="medium"
			bottomContent={<UiBodyCopy>{copy.iAPMigration.body}</UiBodyCopy>}
		/>
	);
};

export { IAPAppMigrationModalCard };
