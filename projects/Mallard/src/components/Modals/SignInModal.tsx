import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { RouteNames } from 'src/navigation/NavigationModels';
import { CenterWrapper } from '../CenterWrapper/CenterWrapper';
import { SignInModalCard } from '../sign-in-modal-card';

const SignInModal = () => {
	const { navigate } = useNavigation();
	return (
		<CenterWrapper>
			<SignInModalCard
				onDismiss={() => navigate(RouteNames.Issue)}
				onLoginPress={() =>
					navigate(RouteNames.Settings, {
						screen: RouteNames.SignIn,
					})
				}
				close={() => navigate(RouteNames.Issue)}
			/>
		</CenterWrapper>
	);
};

export { SignInModal };
