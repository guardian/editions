import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { isIdentityEnabled } from 'src/hooks/use-is-identity-enbaled';
import { useOkta } from 'src/hooks/use-okta-sign-in';
import { RouteNames } from 'src/navigation/NavigationModels';
import { CenterWrapper } from '../CenterWrapper/CenterWrapper';
import { SignInModalCard } from '../sign-in-modal-card';

const SignInModal = () => {
	const { navigate } = useNavigation();
	const { signIn } = useOkta();
	return (
		<CenterWrapper>
			<SignInModalCard
				onDismiss={() => navigate(RouteNames.Issue)}
				onLoginPress={() => {
					isIdentityEnabled
						? navigate(RouteNames.Settings, {
								screen: RouteNames.SignIn,
						  })
						: signIn();
				}}
				close={() => {
					isIdentityEnabled
						? navigate(RouteNames.Issue)
						: navigate(RouteNames.Article);
				}}
			/>
		</CenterWrapper>
	);
};

export { SignInModal };
