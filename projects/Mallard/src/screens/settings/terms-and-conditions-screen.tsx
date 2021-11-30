/* eslint-disable import/order */
import React from 'react';
import { HeaderScreenContainer } from 'src/components/Header/Header';
import { TERMS_HEADER_TITLE } from 'src/helpers/words';
import { DefaultInfoTextWebview } from './default-info-text-webview';

const termsAndConditionsHtml =
	require('src/constants/settings/terms-of-service.json').bodyHtml;

const TermsAndConditionsScreen = () => (
	<HeaderScreenContainer title={TERMS_HEADER_TITLE} actionLeft={true}>
		<DefaultInfoTextWebview html={termsAndConditionsHtml} />
	</HeaderScreenContainer>
);

export { TermsAndConditionsScreen };
