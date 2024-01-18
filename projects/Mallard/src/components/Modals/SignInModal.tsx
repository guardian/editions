import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useOkta } from 'src/hooks/use-okta-sign-in';
import { RouteNames } from 'src/navigation/NavigationModels';
import { CenterWrapper } from '../CenterWrapper/CenterWrapper';
import { SignInModalCard } from '../sign-in-modal-card';

const SignInModal = () => {
	const { navigate } = useNavigation<any>();
	const { signIn } = useOkta();
	return (
		<CenterWrapper>
			<SignInModalCard
				onDismiss={() => navigate(RouteNames.Issue)}
				onLoginPress={signIn}
				close={() => navigate(RouteNames.Issue)}
			/>
		</CenterWrapper>
	);
};

export { SignInModal };
