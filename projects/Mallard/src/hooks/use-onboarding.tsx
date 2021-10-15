import { useEffect, useState } from 'react';
import { useGdprSettings } from 'src/hooks/use-gdpr';

export const useIsOnboarded = () => {
	const [isOnboarded, setIsOnboarded] = useState<boolean>(true);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const {
		hasSetGdpr,
		gdprAllowFunctionality,
		gdprAllowPerformance,
		gdprConsentVersion,
		loading,
	} = useGdprSettings();

	useEffect(() => {
		// If any flag is unknown still, we want to onboard.
		// We expected people to give explicit yay/nay to
		// each GDPR bucket.
		if (!loading) {
			setIsOnboarded(hasSetGdpr());
			setIsLoading(false);
		}
	}, [
		gdprAllowFunctionality,
		gdprAllowPerformance,
		gdprConsentVersion,
		loading,
	]);

	return { isOnboarded, isLoading };
};
