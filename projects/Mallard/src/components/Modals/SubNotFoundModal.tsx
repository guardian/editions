import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useOkta } from 'src/hooks/use-okta-sign-in';
import { RouteNames } from 'src/navigation/NavigationModels';
import { remoteConfigService } from 'src/services/remote-config';
import { CenterWrapper } from '../CenterWrapper/CenterWrapper';
import { SubNotFoundModalCard } from '../sub-not-found-modal-card';

const SubNotFoundModal = () => {
	const { navigate } = useNavigation();
	const { signIn } = useOkta();
	return (
		<CenterWrapper>
			<SubNotFoundModalCard
				close={() => navigate(RouteNames.Issue)}
				onLoginPress={() => {
					const isIdentityEnabled =
						remoteConfigService.getBoolean('identity_enabled');
					isIdentityEnabled
						? navigate(RouteNames.Settings, {
								screen: RouteNames.SignIn,
						  })
						: signIn();
				}}
				onOpenCASLogin={() =>
					navigate(RouteNames.Settings, {
						screen: RouteNames.CasSignIn,
					})
				}
				onDismiss={() => navigate(RouteNames.Issue)}
			/>
		</CenterWrapper>
	);
};

export { SubNotFoundModal };
