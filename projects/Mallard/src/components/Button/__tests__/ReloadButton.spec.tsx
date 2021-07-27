import React from 'react';
import TestRenderer from 'react-test-renderer';
import { ReloadButton } from '../ReloadButton';

describe('ReloadButton', () => {
	it('should display a ReloadButton', () => {
		const component = TestRenderer.create(
			<ReloadButton onPress={() => {}} />,
		).toJSON();
		expect(component).toMatchSnapshot();
	});
});
