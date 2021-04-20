import React, { useEffect, useState } from 'react';
import { HeaderScreenContainer } from 'src/components/Header/Header';
import { CREDITS_HEADER_TITLE } from 'src/helpers/words';
import { DefaultInfoTextWebview } from './default-info-text-webview';

const CreditsScreen = () => {
	const [htmlData, setHtmlData] = useState('loading...');

	useEffect(() => {
		setHtmlData(require('src/constants/settings/credits.json').bodyHtml);
	}, []);

	return (
		<HeaderScreenContainer title={CREDITS_HEADER_TITLE} actionLeft={true}>
			<DefaultInfoTextWebview html={htmlData} />
		</HeaderScreenContainer>
	);
};

export { CreditsScreen };
