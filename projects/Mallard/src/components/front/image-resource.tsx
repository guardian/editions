import { FasterImageView } from '@candlefinance/faster-image';
import React from 'react';
import type { ImageStyle as RNImageStyle, StyleProp } from 'react-native';
import { Platform, Image as RNImage, View } from 'react-native';
import type { Image as IImage, ImageUse } from '../../common';
import { useAspectRatio } from '../../hooks/use-aspect-ratio';
import { useImagePath } from '../../hooks/use-image-paths';

/**
 * This component abstracts away the endpoint for images
 *
 * Bascially it will try to go to the filesystem and if it fails will
 * go to the API
 *
 */
type ImageResourceProps = {
	image: IImage;
	use: ImageUse;
	style?: StyleProp<any>;
	setAspectRatio?: boolean;
	accessibilityLabel?: string;
	isCoverCard?: boolean;
};

const ImageResource = ({
	image,
	style,
	setAspectRatio = false,
	use,
	isCoverCard = false,
	...props
}: ImageResourceProps) => {
	const imagePath = useImagePath(image, use);
	const aspectRatio = useAspectRatio(imagePath);
	const styles = [
		style,
		setAspectRatio && aspectRatio ? { aspectRatio } : {},
	];

	// Cover Cards are not rendering properly for Android using FastImage, so this falls back to React Native Image in this case
	if (imagePath && Platform.OS === 'android' && isCoverCard) {
		return (
			<RNImage
				key={imagePath}
				{...props}
				// resizeMode={FastImage.resizeMode.cover}
				style={[styles, style] as StyleProp<RNImageStyle>}
				source={{ uri: imagePath }}
			/>
		);
	} else if (imagePath) {
		return (
			<FasterImageView
				key={imagePath}
				{...props}
				// resizeMode={FastImage.resizeMode.cover}
				style={[styles, style] as StyleProp<any>}
				source={{ url: imagePath }}
			/>
		);
	} else {
		return <View style={styles}></View>;
	}
};

export { ImageResource };
