import React from 'react';
import Svg, { Circle, Rect } from 'react-native-svg';

const BurgerMenu = () => (
	<Svg width="40" height="40" viewBox="0 0 82 82" fill="none">
		<Circle cx="41" cy="41" r="41" fill="#FFE500" />
		<Rect
			x="17.5714"
			y="25.381"
			width="48.8096"
			height="3.90478"
			fill="#052962"
		/>
		<Rect
			x="17.5714"
			y="39.0476"
			width="48.8096"
			height="3.90477"
			fill="#052962"
		/>
		<Rect
			x="17.5714"
			y="52.7143"
			width="48.8096"
			height="3.90476"
			fill="#052962"
		/>
	</Svg>
);

export { BurgerMenu };
