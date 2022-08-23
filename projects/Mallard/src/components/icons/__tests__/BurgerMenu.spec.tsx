import React from 'react';
import TestRenderer from 'react-test-renderer';
import { BurgerMenu } from '../BurgerMenu';

describe('BurgerMenu', () => {
	it('should display a BurgerMenu icon in SVG', () => {
		const component = TestRenderer.create(<BurgerMenu />).toJSON();
		expect(component).toMatchSnapshot();
	});
});
