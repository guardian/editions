import React from 'react';
import Image from 'react-native-fast-image';
import type { FastImageProps } from 'react-native-fast-image';
import type { Image as ImageType } from 'src/common';
import { useImagePath } from 'src/hooks/use-image-paths';

const cutoutStyles = {
	root: {
		aspectRatio: 1.2,
		width: '100%',
	},
};

export const BylineCutout = ({
	cutout,
	style,
}: {
	cutout: ImageType;
	style?: FastImageProps['style'];
}) => (
	<Image
		resizeMode={'contain'}
		source={{
			uri: useImagePath(cutout),
		}}
		style={[cutoutStyles.root, style]}
	/>
);
