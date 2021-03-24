import React from 'react';
import { Copy } from 'src/helpers/words';
import { CardAppearance, OnboardingCard } from './onboarding/onboarding-card';

const SubFoundModalCard = ({ close }: { close: () => void }) => (
	<OnboardingCard
		title={Copy.subFound.title}
		onDismissThisCard={() => {
			close();
		}}
		subtitle={Copy.subFound.subtitle}
		appearance={CardAppearance.Blue}
		size="small"
		bottomContent={<></>}
	/>
);

export { SubFoundModalCard };
