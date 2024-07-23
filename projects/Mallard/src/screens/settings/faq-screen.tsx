import React from 'react';
import { RenderHTMLWithHeader } from '../../components/RenderHTML/RenderHTML';
import { html } from '../../constants/settings/faqs';
import { FAQS_HEADER_TITLE } from '../../helpers/words';

const FAQScreen = () => (
	<RenderHTMLWithHeader title={FAQS_HEADER_TITLE} html={html} />
);

export { FAQScreen };
