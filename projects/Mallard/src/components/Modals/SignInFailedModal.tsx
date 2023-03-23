import { RouteProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import {
	MainStackParamList,
	RouteNames,
} from 'src/navigation/NavigationModels';
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
	return (
		<CenterWrapper>
			<SignInFailedModalCard
				email={route.params.emailAddress}
				onDismiss={() => navigation.navigate(RouteNames.Issue)}
				onOpenCASLogin={() => navigation.navigate(RouteNames.CasSignIn)}
				onLoginPress={() => navigation.navigate(RouteNames.SignIn)}
				onFaqPress={() => navigation.navigate(RouteNames.FAQ)}
				close={() => navigation.navigate(RouteNames.Issue)}
			/>
		</CenterWrapper>
	);
};

export { SignInFailedModal };
