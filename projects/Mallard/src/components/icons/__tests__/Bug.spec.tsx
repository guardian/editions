import React from 'react';
import TestRenderer from 'react-test-renderer';
import { Bug } from '../Bug';

describe('Bug', () => {
	it('should display a Bug icon in SVG', () => {
		const component = TestRenderer.create(<Bug />).toJSON();
		expect(component).toMatchSnapshot();
	});
});
