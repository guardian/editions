import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { useAccess, useIdentity } from 'src/authentication/AccessContext';
import { RouteNames } from 'src/navigation/NavigationModels';

const useLoginOverlay = () => {
	const { navigate } = useNavigation();
	const canAccess = useAccess();
	const idData = useIdentity();

	useEffect(() => {
		if (!canAccess) {
			const id = setTimeout(() => {
				if (idData) {
					navigate(RouteNames.SubNotFoundModal);
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
