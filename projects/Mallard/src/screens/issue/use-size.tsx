import { createContext, useContext } from 'react';
import type { LayoutRectangle } from 'react-native';
import { Dimensions } from 'react-native';
import { PageLayoutSizes } from '../../common';
import { metrics } from '../../theme/spacing';
import { SLIDER_FRONT_HEIGHT } from '../article/slider/SliderTitle';

const BreakpointContext = createContext<[PageLayoutSizes, LayoutRectangle]>([
	PageLayoutSizes.mobile,
	{ ...Dimensions.get('window'), x: 0, y: 0 },
]);

const useIssueScreenSize = () => {
	const [size, layout] = useContext(BreakpointContext);
	const card: { height: number; width: number } =
		size === PageLayoutSizes.mobile
			? metrics.fronts.cardSize
			: metrics.fronts.cardSizeTablet;
	const container = {
		height: SLIDER_FRONT_HEIGHT + card.height,
		width: layout.width,
	};

	if (layout.width < card.width) {
		card.width = layout.width;
	}

	return { size, card, container, layout };
};

const WithIssueScreenSize = BreakpointContext.Provider;
export { useIssueScreenSize, WithIssueScreenSize };
