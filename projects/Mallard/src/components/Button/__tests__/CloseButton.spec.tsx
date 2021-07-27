import React from 'react';
import TestRenderer from 'react-test-renderer';
import { ButtonAppearance } from '../Button';
import { CloseButton } from '../CloseButton';

describe('CloseButton', () => {
	it('should display a default CloseButton', () => {
		const component = TestRenderer.create(
			<CloseButton
				onPress={() => {}}
				accessibilityHint="Accessibility Hint"
				accessibilityLabel="Accessibility Label"
			/>,
		).toJSON();
		expect(component).toMatchSnapshot();
	});
	it('should display a CloseButton with an alternative appearance', () => {
		const component = TestRenderer.create(
			<CloseButton
				onPress={() => {}}
				accessibilityHint="Accessibility Hint"
				accessibilityLabel="Accessibility Label"
				appearance={ButtonAppearance.Modal}
			/>,
		).toJSON();
		expect(component).toMatchSnapshot();
	});
});
