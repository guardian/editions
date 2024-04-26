import React from 'react';
import TestRenderer from 'react-test-renderer';
import { Spacer } from '../Spacer';

describe('<Spacer />', () => {
	it('should render with default props', () => {
		const wrapper = TestRenderer.create(<Spacer />).toJSON();
		expect(wrapper).toMatchSnapshot();
	});

	it('should render with given props', () => {
		const wrapper = TestRenderer.create(<Spacer unit={30} />).toJSON();
		expect(wrapper).toMatchSnapshot();
	});
});
