import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';
import React from 'react';
import { RegionButton } from './RegionButton';

storiesOf('EditionsMenu', module)
	.addDecorator(withKnobs)
	.add('RegionButton - default', () => (
		<RegionButton
			onPress={() => {}}
			title="Daily Edition"
			subTitle={'Published every day by 6am (GMT)'}
		/>
	))
	.add('RegionButton - selected', () => (
		<RegionButton
			selected
			onPress={() => {}}
			title={'Daily Edition'}
			subTitle={'Published every day by 6am (GMT)'}
		/>
	));
