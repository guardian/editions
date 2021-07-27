import React from 'react';
import TestRenderer from 'react-test-renderer';
import { Quote } from '../Quote';

describe('Quote', () => {
	it('should display a Quote icon in SVG', () => {
		const component = TestRenderer.create(<Quote />).toJSON();
		expect(component).toMatchSnapshot();
	});
});
