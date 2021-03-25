import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useEffect, useState } from 'react';
import { CURRENT_CONSENT_VERSION } from 'src/helpers/settings';

const ONBOARDING_QUERY = gql(`{
    gdprAllowEssential @client
    gdprAllowPerformance @client
    gdprAllowFunctionality @client
    gdprConsentVersion @client
}`);

type OnboardingQueryData = {
	gdprAllowEssential: boolean;
	gdprAllowPerformance: boolean;
	gdprAllowFunctionality: boolean;
	gdprConsentVersion: number;
};

const hasOnboarded = (data: OnboardingQueryData) =>
	data.gdprAllowEssential != null &&
	data.gdprAllowFunctionality != null &&
	data.gdprAllowPerformance != null &&
	data.gdprConsentVersion == CURRENT_CONSENT_VERSION;

export const useIsOnboarded = () => {
	const [isOnboarded, setIsOnboarded] = useState(true);
	const query = useQuery<OnboardingQueryData>(ONBOARDING_QUERY);

	useEffect(() => {
		/** Setting is still loading, do nothing yet. */
		if (query.loading) return;
		const { data } = query;
		// If any flag is unknown still, we want to onboard.
		// We expected people to give explicit yay/nay to
		// each GDPR bucket.
		if (!data || !hasOnboarded(data)) {
			setIsOnboarded(false);
		} else {
			setIsOnboarded(true);
		}
	}, [query]);

	return { isOnboarded };
};
