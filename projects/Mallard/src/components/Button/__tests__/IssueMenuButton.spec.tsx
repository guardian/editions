import React from 'react';
import TestRenderer from 'react-test-renderer';
import { IssueMenuButton } from '../IssueMenuButton';

describe('IssueMenuButton', () => {
	it('should display a IssueMenuButton', () => {
		const component = TestRenderer.create(
			<IssueMenuButton onPress={() => {}} />,
		).toJSON();
		expect(component).toMatchSnapshot();
	});
});
