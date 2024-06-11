/* eslint-disable import/order */
import React from 'react';
import { RenderHTMLWithHeader } from 'src/components/RenderHTML/RenderHTML';
import { html } from 'src/constants/settings/terms-of-service';
import { TERMS_HEADER_TITLE } from 'src/helpers/words';

const TermsAndConditionsScreen = () => (
	<RenderHTMLWithHeader html={html} title={TERMS_HEADER_TITLE} />
);

export { TermsAndConditionsScreen };
