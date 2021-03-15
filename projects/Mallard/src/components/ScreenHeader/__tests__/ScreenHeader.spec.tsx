import React from 'react';
import type { ReactTestRendererJSON } from 'react-test-renderer';
import TestRenderer from 'react-test-renderer';
import { props } from '../fixtures';
import { ScreenHeader } from '../ScreenHeader';

describe('ScreenHeader', () => {
	it('should show a default version', () => {
		const component: ReactTestRendererJSON | null = TestRenderer.create(
			<ScreenHeader title={props.title} />,
		).toJSON();
		expect(component).toMatchSnapshot();
	});
	it('should show a version with title', () => {
		const component: ReactTestRendererJSON | null = TestRenderer.create(
			<ScreenHeader title={props.title} subTitle={props.subTitle} />,
		).toJSON();
		expect(component).toMatchSnapshot();
	});
	it('should show a version with title and subTitle', () => {
		const component: ReactTestRendererJSON | null = TestRenderer.create(
			<ScreenHeader
				title={props.title}
				subTitle={props.subTitle}
				rightAction={props.rightAction}
			/>,
		).toJSON();
		expect(component).toMatchSnapshot();
	});
	it('should show a version with title, subTitle and rightAction', () => {
		const component: ReactTestRendererJSON | null = TestRenderer.create(
			<ScreenHeader />,
		).toJSON();
		expect(component).toMatchSnapshot();
	});
	it('should show a version with title, subTitle, rightAction and leftAction', () => {
		const component: ReactTestRendererJSON | null = TestRenderer.create(
			<ScreenHeader
				title={props.title}
				subTitle={props.subTitle}
				rightAction={props.rightAction}
				leftAction={props.leftAction}
			/>,
		).toJSON();
		expect(component).toMatchSnapshot();
	});
	it('should show a version with title, subTitle, rightAction, leftAction and pressable title', () => {
		const component: ReactTestRendererJSON | null = TestRenderer.create(
			<ScreenHeader
				title={props.title}
				subTitle={props.subTitle}
				rightAction={props.rightAction}
				leftAction={props.leftAction}
				onPress={props.onPress}
			/>,
		).toJSON();
		expect(component).toMatchSnapshot();
	});
	it('should show a version with title, subTitle, rightAction, leftAction, pressable title and header styles', () => {
		const component: ReactTestRendererJSON | null = TestRenderer.create(
			<ScreenHeader {...props} />,
		).toJSON();
		expect(component).toMatchSnapshot();
	});
	it('should show a default version when a subTitle is provided but no title', () => {
		const component: ReactTestRendererJSON | null = TestRenderer.create(
			<ScreenHeader subTitle={props.subTitle} />,
		).toJSON();
		expect(component).toMatchSnapshot();
	});
});
