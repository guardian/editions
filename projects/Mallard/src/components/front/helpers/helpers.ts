import type { FunctionComponent } from 'react';
import type { Rectangle, Size } from '../../../common';
import { PageLayoutSizes } from '../../../common';
import { useArticle } from '../../../hooks/use-article';
import { useAppAppearance } from '../../../theme/appearance';
import type { PropTypes } from '../items/helpers/item-tappable';

export type Item = FunctionComponent<PropTypes>;

export const getPageLayoutSizeXY = (size: PageLayoutSizes): Size => {
	if (size === PageLayoutSizes.tablet) {
		return { width: 3, height: 4 };
	}
	return { width: 2, height: 6 };
};

/*
This resolves where each article goes
*/

export const getItemRectanglePerc = (
	itemFit: Rectangle,
	layout: PageLayoutSizes,
): Rectangle => {
	const layoutSize = getPageLayoutSizeXY(layout);
	return {
		left: itemFit.left / layoutSize.width,
		top: itemFit.top / layoutSize.height,
		height: itemFit.height / layoutSize.height,
		width: itemFit.width / layoutSize.width,
	};
};

export const toAbsoluteRectangle = (
	rectangle: Rectangle,
	cardSize: Size,
): Rectangle => ({
	left: rectangle.left * cardSize.width,
	width: rectangle.width * cardSize.width,
	top: rectangle.top * cardSize.height,
	height: rectangle.height * cardSize.height,
});

/*get the card bg */
export const useCardBackgroundStyle = () => {
	const [color, { pillar }] = useArticle();
	const appColor = useAppAppearance();
	return pillar !== 'news' && pillar !== 'sport'
		? { backgroundColor: color.faded }
		: { backgroundColor: appColor.cardBackgroundColor };
};
