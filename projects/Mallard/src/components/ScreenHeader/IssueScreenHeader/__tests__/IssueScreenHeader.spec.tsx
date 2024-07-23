import React from 'react';
import TestRenderer from 'react-test-renderer';
import MockedNavigator from 'src/__mocks__/@react-navigation';
import type { IssueOrigin } from 'src/common';
import { IssueScreenHeader } from '../IssueScreenHeader';

jest.mock('src/helpers/analytics', () => ({
	logEvent: jest.fn,
}));

jest.mock('@delightfulstudio/react-native-safe-area-insets', () => ({
	currentInsets: () => Promise.resolve({ top: 10 }),
}));

const issue = {
	name: 'Daily Edition',
	date: '2020-06-25',
	key: 'daily-edition/2020-06-25',
	publishedId: 'daily-edition/2020-06-25/2020-06-25T00:58:19.4Z',
	localId: 'daily-edition/2020-06-25',
	fronts: [],
	origin: 'api' as IssueOrigin,
};

describe('IssueScreenHeader', () => {
	it('should match the default style', () => {
		const component = TestRenderer.create(
			<MockedNavigator
				component={IssueScreenHeader}
				props={{ issue: issue }}
			/>,
		).toJSON();
		expect(component).toMatchSnapshot();
	});
	it('should match the altered style by the prop headerStyles', () => {
		const component = TestRenderer.create(
			<MockedNavigator
				component={IssueScreenHeader}
				props={{
					issue: issue,
					haeaderStyles: {
						backgroundColor: '#7D0068',
						textColorPrimary: '#007ABC',
						textColorSecondary: '#F3C100',
					},
				}}
			/>,
		).toJSON();
		expect(component).toMatchSnapshot();
	});
});
