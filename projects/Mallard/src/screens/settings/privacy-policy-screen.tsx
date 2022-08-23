import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { LoginHeader } from 'src/components/login/login-layout';
import {
	RenderHTMLWithHeader,
	RenderHTMLwithScrollView,
} from 'src/components/RenderHTML/RenderHTML';
import { html } from 'src/constants/settings/privacy-policy';
import { PRIVACY_POLICY_HEADER_TITLE } from 'src/helpers/words';

const PrivacyPolicyScreen = () => (
	<RenderHTMLWithHeader html={html} title={PRIVACY_POLICY_HEADER_TITLE} />
);

const PrivacyPolicyScreenForOnboarding = () => {
	const navigation = useNavigation();
	return (
		<>
			<LoginHeader onDismiss={() => navigation.goBack()}>
				{PRIVACY_POLICY_HEADER_TITLE}
			</LoginHeader>
			<RenderHTMLwithScrollView html={html} />
		</>
	);
};

export { PrivacyPolicyScreen, PrivacyPolicyScreenForOnboarding };
