import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useOkta } from 'src/hooks/use-okta-sign-in';
import { RouteNames } from 'src/navigation/NavigationModels';
import { remoteConfigService } from 'src/services/remote-config';
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
					const isIdentityEnabled =
						remoteConfigService.getBoolean('identity_enabled');
					isIdentityEnabled
						? navigate(RouteNames.Settings, {
								screen: RouteNames.SignIn,
						  })
						: signIn();
				}}
				close={() => {
					const isIdentityEnabled =
						remoteConfigService.getBoolean('identity_enabled');
					isIdentityEnabled
						? navigate(RouteNames.Issue)
						: navigate(RouteNames.Article);
				}}
			/>
		</CenterWrapper>
	);
};

export { SignInModal };
