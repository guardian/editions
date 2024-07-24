import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { LoginHeader } from '../../components/login/login-layout';
import {
	RenderHTMLWithHeader,
	RenderHTMLwithScrollView,
} from '../../components/RenderHTML/RenderHTML';
import { html } from '../../constants/settings/privacy-policy';
import { PRIVACY_POLICY_HEADER_TITLE } from '../../helpers/words';
import type { MainStackParamList } from '../../navigation/NavigationModels';

const PrivacyPolicyScreen = () => (
	<RenderHTMLWithHeader html={html} title={PRIVACY_POLICY_HEADER_TITLE} />
);

const PrivacyPolicyScreenForOnboarding = () => {
	const navigation =
		useNavigation<NativeStackNavigationProp<MainStackParamList>>();
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
