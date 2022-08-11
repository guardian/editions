import React from 'react';
import { RenderHTMLWithHeader } from 'src/components/RenderHTML/RenderHTML';
import { html } from 'src/constants/settings/credits';
import { CREDITS_HEADER_TITLE } from 'src/helpers/words';

const CreditsScreen = () => (
	<RenderHTMLWithHeader html={html} title={CREDITS_HEADER_TITLE} />
);

export { CreditsScreen };
