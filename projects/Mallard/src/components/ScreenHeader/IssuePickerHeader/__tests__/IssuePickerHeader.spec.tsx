import React from 'react';
import TestRenderer from 'react-test-renderer';
import MockedNavigator from '../../../../__mocks__/@react-navigation';
import { IssuePickerHeader } from '../IssuePickerHeader';

jest.mock('@delightfulstudio/react-native-safe-area-insets', () => ({
	currentInsets: () => Promise.resolve({ top: 10 }),
}));

describe('IssuePickerHeader', () => {
	it('should match the default style', () => {
		const component = TestRenderer.create(
			<MockedNavigator
				component={IssuePickerHeader}
				props={{ title: 'UK', subTitle: 'Daily' }}
			/>,
		).toJSON();
		expect(component).toMatchSnapshot();
	});
	it('should match the default style with a subTitle', () => {
		const component = TestRenderer.create(
			<MockedNavigator
				component={IssuePickerHeader}
				props={{ title: 'Recent', subTitle: 'Editions' }}
			/>,
		).toJSON();
		expect(component).toMatchSnapshot();
	});
	it('should match the altered style by the prop headerStyles', () => {
		const component = TestRenderer.create(
			<MockedNavigator
				component={IssuePickerHeader}
				props={{
					title: 'UK',
					subTitle: 'Daily',
					headerStyles: {
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
