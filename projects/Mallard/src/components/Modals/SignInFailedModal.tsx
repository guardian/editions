import { useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import React from 'react';
import { isIdentityEnabled } from 'src/hooks/use-is-identity-enbaled';
import { useOkta } from 'src/hooks/use-okta-sign-in';
import { RouteNames } from 'src/navigation/NavigationModels';
import type { MainStackParamList } from 'src/navigation/NavigationModels';
import { CenterWrapper } from '../CenterWrapper/CenterWrapper';
import { SignInFailedModalCard } from '../SignInFailedModalCard';

export type SignInFailedProps = {
	emailAddress: string;
};

const SignInFailedModal = ({
	route,
}: {
	route: RouteProp<MainStackParamList, 'SignInFailedModal'>;
}) => {
	const navigation = useNavigation();
	const { signIn, signOut } = useOkta();
	return (
		<CenterWrapper>
			<SignInFailedModalCard
				email={route.params.emailAddress}
				onDismiss={() => navigation.navigate(RouteNames.Issue)}
				onOpenCASLogin={() =>
					navigation.navigate(RouteNames.Settings, {
						screen: RouteNames.CasSignIn,
					})
				}
				onLoginPress={async () => {
					if (isIdentityEnabled) {
						navigation.navigate(RouteNames.Settings, {
							screen: RouteNames.SignIn,
						});
					} else {
						await signOut();
						await signIn();
					}
				}}
				onFaqPress={() =>
					navigation.navigate(RouteNames.Settings, {
						screen: RouteNames.FAQ,
					})
				}
				close={() => navigation.navigate(RouteNames.Issue)}
			/>
		</CenterWrapper>
	);
};

export { SignInFailedModal };
