/* eslint-disable import/order */
import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import type { CustomBlockRenderer } from 'react-native-render-html';
import RenderHTMLasNative, {
	defaultSystemFonts,
	useInternalRenderer,
} from 'react-native-render-html';

import { HeaderScreenContainer } from '../../components/Header/Header';
import { families } from '../../theme/typography';

import { BurgerMenu } from '../icons/BurgerMenu';
import { SettingsCog } from '../icons/SettingsCog';
import { AppLogo } from '../icons/AppLogo';

import { EditionsMenu } from '../icons/EditionsMenu';
import { Button } from '../Button/Button';
import { color } from '../../theme/color';

const customFonts = Object.values(families).reduce(
	(acc: string[], value) => [...acc, ...Object.values(value)],
	[],
);

const sysetmFonts = [...defaultSystemFonts, ...customFonts];
const tagsStyles = {
	body: {
		padding: 20,
		color: color.text,
	},
	h2: {
		fontFamily: 'GuardianTextEgyptian-Reg',
		fontSize: 26,
		lineHeight: 32,
	},
	h3: {
		fontFamily: 'GuardianTextEgyptian-Reg',
		fontSize: 20,
		lineHeight: 26,
	},
	p: {
		fontFamily: 'GuardianTextEgyptian-Reg',
		fontSize: 18,
		lineHeight: 24,
	},
	ul: {
		marginLeft: 0,
		paddingLeft: 10,
	},
	li: {
		fontFamily: 'GuardianTextEgyptian-Reg',
		fontSize: 18,
		paddingLeft: 10,
		lineHeight: 24,
	},
};

type AllowableSVGImages =
	| 'appLogo'
	| 'bug'
	| 'burgerMenu'
	| 'editionsMenu'
	| 'settingsCog';

const images = {
	appLogo: <AppLogo />,
	bug: <Button onPress={() => {}} icon="" alt="Example button" />,
	burgerMenu: <BurgerMenu />,
	editionsMenu: <EditionsMenu />,
	settingsCog: <SettingsCog />,
};

const imageRenderer: CustomBlockRenderer = (props) => {
	const { Renderer, rendererProps } = useInternalRenderer('img', props);
	const imageSource = rendererProps?.source?.uri?.replace('about:///', '');
	return images[imageSource as AllowableSVGImages] !== undefined ? (
		images[imageSource as AllowableSVGImages]
	) : (
		<Renderer {...rendererProps} />
	);
};

const RenderHTML = ({ html }: { html: string }) => (
	<RenderHTMLasNative
		source={{ html }}
		tagsStyles={tagsStyles}
		systemFonts={sysetmFonts}
		renderers={{
			img: imageRenderer,
		}}
	/>
);

const RenderHTMLwithScrollView = ({ html }: { html: string }) => (
	<ScrollView>
		<RenderHTML html={html} />
	</ScrollView>
);

const RenderHTMLWithHeader = ({
	html,
	title,
}: {
	html: string;
	title: string;
}) => (
	<HeaderScreenContainer title={title} actionLeft={true}>
		<RenderHTMLwithScrollView html={html} />
	</HeaderScreenContainer>
);

export { RenderHTML, RenderHTMLwithScrollView, RenderHTMLWithHeader };
