import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { useAccess, useOktaData } from 'src/authentication/AccessContext';
import { RouteNames } from 'src/navigation/NavigationModels';

const useLoginOverlay = () => {
	const { navigate } = useNavigation();
	const canAccess = useAccess();
	const oktaData = useOktaData();

	useEffect(() => {
		if (!canAccess) {
			const id = setTimeout(() => {
				if (oktaData) {
					navigate(RouteNames.SignInFailedModal, {
						emailAddress: oktaData.userDetails.preferred_username,
					});
				} else {
					navigate(RouteNames.SignInModal);
				}
			}, 3000);
			return () => clearTimeout(id);
		}
	}, []);

	return null;
};

export { useLoginOverlay };
