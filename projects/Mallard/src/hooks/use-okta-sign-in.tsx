import { useNavigation } from '@react-navigation/native';
import { useContext, useState } from 'react';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
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
		// Okta signin doesnt work on older Android devices, so we push users to use their
		// subscriber id instead on the CAS sign in screen
		if (Platform.OS === 'android') {
			const androidAPILevel = await DeviceInfo.getApiLevel();
			// 27 === Android 8.1
			if (androidAPILevel < 27) {
				navigation.navigate(RouteNames.CasSignIn);
			}
		}

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
