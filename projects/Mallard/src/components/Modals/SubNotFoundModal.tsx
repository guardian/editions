import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { isIdentityEnabled } from 'src/hooks/use-is-identity-enbaled';
import { useOkta } from 'src/hooks/use-okta-sign-in';
import { RouteNames } from 'src/navigation/NavigationModels';
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
