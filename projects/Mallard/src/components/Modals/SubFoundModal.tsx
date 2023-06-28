import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Copy } from 'src/helpers/words';
import { RouteNames } from 'src/navigation/NavigationModels';
import { remoteConfigService } from 'src/services/remote-config';
import { CenterWrapper } from '../CenterWrapper/CenterWrapper';
import { CardAppearance, OnboardingCard } from '../onboarding/onboarding-card';

const SubFoundModalCard = () => {
	const { goBack, navigate } = useNavigation();
	return (
		<CenterWrapper>
			<OnboardingCard
				title={Copy.subFound.title}
				onDismissThisCard={() => {
					const isIdentityEnabled =
						remoteConfigService.getBoolean('identity_enabled');
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
