import React from 'react';
import TestRenderer from 'react-test-renderer';
import { SettingsCog } from '../SettingsCog';

describe('SettingsCog', () => {
	it('should display a SettingsCog icon in SVG', () => {
		const component = TestRenderer.create(<SettingsCog />).toJSON();
		expect(component).toMatchSnapshot();
	});
});
