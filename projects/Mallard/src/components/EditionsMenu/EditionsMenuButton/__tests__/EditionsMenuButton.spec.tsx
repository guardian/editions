import React from 'react';
import TestRenderer from 'react-test-renderer';
import { EditionsMenuButton } from '../EditionsMenuButton';

describe('EditionsMenuButton', () => {
	it('should display a default EditionsMenuButton with correct styling', () => {
		const component = TestRenderer.create(
			<EditionsMenuButton onPress={() => {}} />,
		).toJSON();
		expect(component).toMatchSnapshot();
	});
	it('should display a selected EditionsMenuButton with correct styling', () => {
		const component = TestRenderer.create(
			<EditionsMenuButton selected onPress={() => {}} />,
		).toJSON();
		expect(component).toMatchSnapshot();
	});
});
