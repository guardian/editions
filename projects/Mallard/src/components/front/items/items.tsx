import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { Image } from 'src/common';
import { PageLayoutSizes } from 'src/common';
import { HeadlineCardText } from 'src/components/styled-text';
import { ImageResource } from '../image-resource';
import type { PropTypes } from './helpers/item-tappable';
import { ItemTappable } from './helpers/item-tappable';
import { ImageItem, SidekickImageItem, SplitImageItem } from './image-items';
import { SmallItem, SmallItemLargeText } from './small-items';
import { SuperHeroImageItem } from './super-items';

/*
helpers
*/

/*
SPLASH ITEM
Image only
*/
const splashImageStyles = StyleSheet.create({
	image: {
		width: '100%',
		flex: 0,
	},
	hidden: {
		opacity: 0,
	},
	overflow: {
		overflow: 'hidden',
	},
});

const SplashImageItem = ({ article, size, ...tappableProps }: PropTypes) => {
	if (!article.cardImage || !article.cardImageTablet)
		return <SuperHeroImageItem {...tappableProps} {...{ article, size }} />;

	const cardImage: Image =
		size.layout === PageLayoutSizes.mobile
			? {
					source: article?.cardImage?.source || '',
					path: article?.cardImage?.path || '',
			  }
			: {
					source: article?.cardImageTablet?.source || '',
					path: article?.cardImageTablet?.path || '',
			  };

	return (
		<ItemTappable {...tappableProps} {...{ article }} hasPadding={false}>
			<View style={splashImageStyles.overflow}>
				<ImageResource
					style={[splashImageStyles.image]}
					image={cardImage}
					setAspectRatio
					use="full-size"
					accessibilityLabel={article.headline}
				/>
			</View>
			<HeadlineCardText style={[splashImageStyles.hidden]}>
				{article.kicker}
			</HeadlineCardText>
		</ItemTappable>
	);
};

export {
	SplashImageItem,
	SuperHeroImageItem,
	ImageItem,
	SplitImageItem,
	SmallItem,
	SmallItemLargeText,
	SidekickImageItem,
};
