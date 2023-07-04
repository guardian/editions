import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Copy } from 'src/helpers/words';
import { isIdentityEnabled } from 'src/hooks/use-is-identity-enbaled';
import { RouteNames } from 'src/navigation/NavigationModels';
import { CenterWrapper } from '../CenterWrapper/CenterWrapper';
import { CardAppearance, OnboardingCard } from '../onboarding/onboarding-card';

const SubFoundModalCard = () => {
	const { goBack, navigate } = useNavigation();
	return (
		<CenterWrapper>
			<OnboardingCard
				title={Copy.subFound.title}
				onDismissThisCard={() => {
					isIdentityEnabled ? navigate(RouteNames.Issue) : goBack();
				}}
				subtitle={Copy.subFound.subtitle}
				appearance={CardAppearance.Blue}
				size="small"
				bottomContent={<></>}
			/>
		</CenterWrapper>
	);
};

export { SubFoundModalCard };
