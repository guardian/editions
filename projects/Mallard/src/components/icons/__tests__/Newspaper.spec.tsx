import React from 'react';
import TestRenderer from 'react-test-renderer';
import { Newspaper } from '../Newspaper';

describe('Newspaper', () => {
	it('should display a Newspaper icon in SVG', () => {
		const component = TestRenderer.create(<Newspaper />).toJSON();
		expect(component).toMatchSnapshot();
	});
});
