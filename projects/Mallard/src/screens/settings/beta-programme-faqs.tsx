import React from 'react';
import { RenderHTMLWithHeader } from '../../components/RenderHTML/RenderHTML';
import { html } from '../../constants/settings/beta-faqs';
import { BETA_PROGRAMME_FAQ_HEADER_TITLE } from '../../helpers/words';

const BetaProgrammeFAQsScreen = () => (
	<RenderHTMLWithHeader title={BETA_PROGRAMME_FAQ_HEADER_TITLE} html={html} />
);

export { BetaProgrammeFAQsScreen };
