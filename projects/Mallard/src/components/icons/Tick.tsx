import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { color } from 'src/theme/color';

const width = 20;
const height = 16;

const Tick = ({ fill = color.ui.supportBlue }) => (
	<Svg width={width} height={height} fill="none">
		<Path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M0.999997 7.77497L0 8.77497L4.99998 15.7749H5.47498L19.7749 0.974997L18.7749 0L5.47498 12.05L0.999997 7.77497Z"
			fill={fill}
		/>
	</Svg>
);

export { Tick };
