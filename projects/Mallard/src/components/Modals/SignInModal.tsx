import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { useOkta } from '../../hooks/use-okta-sign-in';
import type { MainStackParamList } from '../../navigation/NavigationModels';
import { RouteNames } from '../../navigation/NavigationModels';
import { CenterWrapper } from '../CenterWrapper/CenterWrapper';
import { SignInModalCard } from '../sign-in-modal-card';

const SignInModal = () => {
	const { navigate } =
		useNavigation<NativeStackNavigationProp<MainStackParamList>>();
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
