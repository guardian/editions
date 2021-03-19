/* eslint-disable import/order */
import React from 'react';
import { HeaderScreenContainer } from 'src/components/Header/Header';
import { DefaultInfoTextWebview } from './default-info-text-webview';

const termsAndConditionsHtml = require('src/constants/settings/terms-of-service.json')
	.bodyHtml;

const TermsAndConditionsScreen = () => (
	<HeaderScreenContainer title="Terms &amp; Conditions" actionLeft={true}>
		<DefaultInfoTextWebview html={termsAndConditionsHtml} />
	</HeaderScreenContainer>
);

export { TermsAndConditionsScreen };
