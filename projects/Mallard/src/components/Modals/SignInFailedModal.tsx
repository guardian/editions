import { useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { useOkta } from '../../hooks/use-okta-sign-in';
import { RouteNames } from '../../navigation/NavigationModels';
import type { MainStackParamList } from '../../navigation/NavigationModels';
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
	const navigation =
		useNavigation<NativeStackNavigationProp<MainStackParamList>>();
	const { signIn, signOut } = useOkta();
	return (
		<CenterWrapper>
			<SignInFailedModalCard
				email={route.params.emailAddress}
				onDismiss={() => navigation.navigate(RouteNames.Issue)}
				onOpenCASLogin={() => navigation.navigate(RouteNames.CasSignIn)}
				onLoginPress={async () => {
					await signOut();
					await signIn();
				}}
				close={() => navigation.navigate(RouteNames.Issue)}
			/>
		</CenterWrapper>
	);
};

export { SignInFailedModal };
