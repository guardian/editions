import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Copy } from 'src/helpers/words';
import { CenterWrapper } from '../CenterWrapper/CenterWrapper';
import { CardAppearance, OnboardingCard } from '../onboarding/onboarding-card';

const SubFoundModalCard = () => {
	const { goBack } = useNavigation();
	return (
		<CenterWrapper>
			<OnboardingCard
				title={Copy.subFound.title}
				onDismissThisCard={goBack}
				subtitle={Copy.subFound.subtitle}
				appearance={CardAppearance.Blue}
				size="small"
				bottomContent={<></>}
			/>
		</CenterWrapper>
	);
};

export { SubFoundModalCard };
