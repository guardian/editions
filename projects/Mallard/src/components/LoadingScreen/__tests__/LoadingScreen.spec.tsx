import React from 'react';
import TestRenderer from 'react-test-renderer';
import { LoadingScreen } from '../../../components/LoadingScreen/LoadingScreen';

jest.mock('../../../components/Spinner/Spinner', () => ({
	Spinner: () => '<Spinner />',
}));

describe('LoadingScreen', () => {
	it('should show a LoadingScreen with default styling', () => {
		const component = TestRenderer.create(<LoadingScreen />).toJSON();
		expect(component).toMatchSnapshot();
	});
});
