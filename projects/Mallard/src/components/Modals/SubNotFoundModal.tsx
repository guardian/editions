import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { RouteNames } from 'src/navigation/NavigationModels';
import { CenterWrapper } from '../CenterWrapper/CenterWrapper';
import { SubNotFoundModalCard } from '../sub-not-found-modal-card';

const SubNotFoundModal = () => {
	const { navigate } = useNavigation();
	return (
		<CenterWrapper>
			<SubNotFoundModalCard
				close={() => navigate(RouteNames.Issue)}
				onLoginPress={() =>
					navigate(RouteNames.Settings, {
						screen: RouteNames.SignIn,
					})
				}
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
