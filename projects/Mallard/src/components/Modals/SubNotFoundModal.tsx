import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { useOkta } from '../../hooks/use-okta-sign-in';
import type { MainStackParamList } from '../../navigation/NavigationModels';
import { RouteNames } from '../../navigation/NavigationModels';
import { CenterWrapper } from '../CenterWrapper/CenterWrapper';
import { SubNotFoundModalCard } from '../sub-not-found-modal-card';

const SubNotFoundModal = () => {
	const { navigate } =
		useNavigation<NativeStackNavigationProp<MainStackParamList>>();
	const { signIn } = useOkta();
	return (
		<CenterWrapper>
			<SubNotFoundModalCard
				close={() => navigate(RouteNames.Issue)}
				onLoginPress={signIn}
				onOpenCASLogin={() => navigate(RouteNames.CasSignIn)}
				onDismiss={() => navigate(RouteNames.Issue)}
			/>
		</CenterWrapper>
	);
};

export { SubNotFoundModal };
