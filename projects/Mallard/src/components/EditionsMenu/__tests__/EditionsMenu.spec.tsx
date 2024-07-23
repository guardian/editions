import React from 'react';
import TestRenderer from 'react-test-renderer';
import { editions, regionalEditions, specialEditions } from '../../../common';
import { EditionsMenu } from '../EditionsMenu';

jest.mock(
	'../../../components/EditionsMenu/EditionButton/EditionButton',
	() => ({
		EditionButton: () => 'EditionButton',
	}),
);

jest.mock('../../../helpers/analytics', () => ({
	logEvent: jest.fn,
}));

const props = {
	navigationPress: () => {},
	selectedEdition: editions.daily,
	storeSelectedEdition: () => {},
};

describe('EditionsMenu', () => {
	it('should display a default EditionsMenu with correct styling and default Regional Buttons', () => {
		const component = TestRenderer.create(
			<EditionsMenu {...props} />,
		).toJSON();
		expect(component).toMatchSnapshot();
	});
	it('should display a EditionsMenu with correct styling and alternative Regional Buttons', () => {
		const component = TestRenderer.create(
			<EditionsMenu {...props} regionalEditions={regionalEditions} />,
		).toJSON();
		expect(component).toMatchSnapshot();
	});
	it('should display a EditionsMenu with correct styling default Regional Buttons and a Special Edition Button', () => {
		const component = TestRenderer.create(
			<EditionsMenu {...props} specialEditions={specialEditions} />,
		).toJSON();
		expect(component).toMatchSnapshot();
	});
});
