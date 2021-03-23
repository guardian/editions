import React from 'react';
import type { ReactTestRendererJSON } from 'react-test-renderer';
import TestRenderer from 'react-test-renderer';
import { IssuePickerHeader } from '../IssuePickerHeader';

const navigate = jest.fn();

describe('IssuePickerHeader', () => {
	it('should match the default style', () => {
		const component: ReactTestRendererJSON | null = TestRenderer.create(
			<IssuePickerHeader
				title="UK"
				subTitle="Daily"
				navigation={{ navigate }}
			/>,
		).toJSON();
		expect(component).toMatchSnapshot();
	});
	it('should match the default style with a subTitle', () => {
		const component: ReactTestRendererJSON | null = TestRenderer.create(
			<IssuePickerHeader
				title="Recent"
				subTitle="Editions"
				navigation={{ navigate }}
			/>,
		).toJSON();
		expect(component).toMatchSnapshot();
	});
	it('should match the altered style by the prop headerStyles', () => {
		const component: ReactTestRendererJSON | null = TestRenderer.create(
			<IssuePickerHeader
				title="UK"
				subTitle="Daily"
				navigation={{ navigate }}
				headerStyles={{
					backgroundColor: '#7D0068',
					textColorPrimary: '#007ABC',
					textColorSecondary: '#F3C100',
				}}
			/>,
		).toJSON();
		expect(component).toMatchSnapshot();
	});
});
