import React from 'react';
import TestRenderer from 'react-test-renderer';
import { Editions } from '../Editions';

describe('Editions', () => {
	it('should display a Editions icon in SVG', () => {
		const component = TestRenderer.create(<Editions />).toJSON();
		expect(component).toMatchSnapshot();
	});
});
