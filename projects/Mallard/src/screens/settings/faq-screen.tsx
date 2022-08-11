import React from 'react';
import { RenderHTMLWithHeader } from 'src/components/RenderHTML/RenderHTML';
import { html } from 'src/constants/settings/faqs';
import { FAQS_HEADER_TITLE } from 'src/helpers/words';

const FAQScreen = () => (
	<RenderHTMLWithHeader title={FAQS_HEADER_TITLE} html={html} />
);

export { FAQScreen };
