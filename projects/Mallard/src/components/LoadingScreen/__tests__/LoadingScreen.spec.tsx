import React from 'react';
import TestRenderer from 'react-test-renderer';
import { LoadingScreen } from 'src/components/LoadingScreen/LoadingScreen';

jest.mock('src/components/Spinner/Spinner', () => ({
	Spinner: () => '<Spinner />',
}));

describe('LoadingScreen', () => {
	it('should show a LoadingScreen with default styling', () => {
		const component = TestRenderer.create(<LoadingScreen />).toJSON();
		expect(component).toMatchSnapshot();
	});
});
