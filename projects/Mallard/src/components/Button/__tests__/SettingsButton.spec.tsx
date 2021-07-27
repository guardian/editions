import React from 'react';
import TestRenderer from 'react-test-renderer';
import { SettingsButton } from '../SettingsButton';

describe('SettingsButton', () => {
	it('should display a SettingsButton', () => {
		const component = TestRenderer.create(
			<SettingsButton onPress={() => {}} />,
		).toJSON();
		expect(component).toMatchSnapshot();
	});
});
