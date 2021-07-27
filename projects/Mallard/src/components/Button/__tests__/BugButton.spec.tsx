import React from 'react';
import TestRenderer from 'react-test-renderer';
import { BugButton } from '../BugButton';

describe('BugButton', () => {
	it('should display a BugButton', () => {
		const component = TestRenderer.create(
			<BugButton onPress={() => {}} />,
		).toJSON();
		expect(component).toMatchSnapshot();
	});
});
