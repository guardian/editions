import { useNavigation } from '@react-navigation/native';
import { useContext, useState } from 'react';
import { AccessContext } from 'src/authentication/AccessContext';
import { isValid } from 'src/authentication/lib/Attempt';
import { oktaSignOut } from 'src/authentication/services/okta';
import type { CompositeNavigationStackProps } from 'src/navigation/NavigationModels';
import { RouteNames } from 'src/navigation/NavigationModels';

const useOkta = () => {
	const { authOkta, signOutOkta } = useContext(AccessContext);
	const navigation = useNavigation<CompositeNavigationStackProps>();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const signIn = async () => {
		setIsLoading(true);
		try {
			const { attempt, accessAttempt } = await authOkta();
			if (isValid(attempt)) {
				setIsLoading(false);
				if (!isValid(accessAttempt)) {
					navigation.navigate(RouteNames.SignInFailedModal, {
						emailAddress:
							attempt.data.userDetails.preferred_username,
					});
				} else {
					navigation.navigate(RouteNames.SubFoundModal);
				}
			} else {
				attempt.reason && setError(attempt.reason);
				// push this into the catch logic below
				throw attempt.reason;
			}
			setIsLoading(false);
		} catch (e) {
			setError('Something went wrong with sign in, please try again.');
			setIsLoading(false);
			navigation.goBack();
		}
	};

	const signOut = async () => {
		try {
			setIsLoading(true);
			await oktaSignOut();
			await signOutOkta();
			setIsLoading(false);
		} catch {
			setIsLoading(false);
		}
	};

	return {
		error,
		isLoading,
		signIn,
		signOut,
	};
};

export { useOkta };
