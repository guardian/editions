import React from 'react';
import type { ImageStyle } from 'react-native-fast-image';
import Image from 'react-native-fast-image';
import type { Image as ImageType } from '../../../../common';
import { useImagePath } from '../../../../hooks/use-image-paths';

const cutoutStyles = {
	root: {
		aspectRatio: 1.2,
		width: '100%',
	},
};

export const BylineCutout = ({ cutout }: { cutout: ImageType }) => (
	<Image
		resizeMode={'contain'}
		source={{
			uri: useImagePath(cutout),
		}}
		style={cutoutStyles.root as ImageStyle}
	/>
);
