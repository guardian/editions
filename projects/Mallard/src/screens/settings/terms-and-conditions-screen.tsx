/* eslint-disable import/order */
import React from 'react';
import { RenderHTMLWithHeader } from '../../components/RenderHTML/RenderHTML';
import { html } from '../../constants/settings/terms-of-service';
import { TERMS_HEADER_TITLE } from '../../helpers/words';

const TermsAndConditionsScreen = () => (
	<RenderHTMLWithHeader html={html} title={TERMS_HEADER_TITLE} />
);

export { TermsAndConditionsScreen };
