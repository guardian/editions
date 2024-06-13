import React from 'react';
import { RenderHTMLWithHeader } from 'src/components/RenderHTML/RenderHTML';
import { html } from 'src/constants/settings/beta-faqs';
import { BETA_PROGRAMME_FAQ_HEADER_TITLE } from 'src/helpers/words';

const BetaProgrammeFAQsScreen = () => (
	<RenderHTMLWithHeader title={BETA_PROGRAMME_FAQ_HEADER_TITLE} html={html} />
);

export { BetaProgrammeFAQsScreen };
