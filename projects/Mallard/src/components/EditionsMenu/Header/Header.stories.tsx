import { text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';
import React from 'react';
import { EditionsMenuHeader } from './Header';

storiesOf('EditionsMenu', module)
	.addDecorator(withKnobs)
	.add('EditionsMenuHeader - default', () => (
		<EditionsMenuHeader>
			{text('Header Text', 'Regions')}
		</EditionsMenuHeader>
	));
