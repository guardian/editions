import React from 'react';
import TestRenderer from 'react-test-renderer';
import { AppLogo } from '../AppLogo';

describe('AppLogo', () => {
	it('should display a AppLogo icon in SVG', () => {
		const component = TestRenderer.create(<AppLogo />).toJSON();
		expect(component).toMatchSnapshot();
	});
});
