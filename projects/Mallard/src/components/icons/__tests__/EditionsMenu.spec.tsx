import React from 'react';
import TestRenderer from 'react-test-renderer';
import { EditionsMenu } from '../EditionsMenu';

describe('EditionsMenu', () => {
	it('should display a EditionsMenu icon in SVG', () => {
		const component = TestRenderer.create(<EditionsMenu />).toJSON();
		expect(component).toMatchSnapshot();
	});
});
