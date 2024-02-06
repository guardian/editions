import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import {
	useAccess,
	useIdentity,
	useOktaData,
} from 'src/authentication/AccessContext';
import type { MainStackParamList } from 'src/navigation/NavigationModels';
import { RouteNames } from 'src/navigation/NavigationModels';

const useLoginOverlay = () => {
	const { navigate } =
		useNavigation<NativeStackNavigationProp<MainStackParamList>>();
	const canAccess = useAccess();
	const oktaData = useOktaData();
	const idData = useIdentity();

	useEffect(() => {
		if (!canAccess) {
			const id = setTimeout(() => {
				if (idData) {
					navigate(RouteNames.SubNotFoundModal);
				} else if (oktaData) {
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
