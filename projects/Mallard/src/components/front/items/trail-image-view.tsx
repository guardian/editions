import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';
import type { ImageStyle } from 'react-native-fast-image';
import type { CAPIArticle, ImageUse } from '../../../common';
import { ArticleType } from '../../../common';
import { SportScore } from '../../../components/SportScore/SportScore';
import { Stars } from '../../../components/Stars/Stars';
import { useMediaQuery } from '../../../hooks/use-screen';
import { Breakpoints } from '../../../theme/breakpoints';
import { ImageResource } from '../image-resource';

const trailImageViewStyles = StyleSheet.create({
	frame: {
		width: '100%',
		flex: 0,
	},
	image: {
		width: '100%',
		height: '100%',
	},
	rating: {
		position: 'absolute',
		backgroundColor: 'white',
		left: 0,
		bottom: 0,
	},
});

/**
 * If there is a rating for the article (ex. a theater piece rating) then we
 * display it in the bottom-left corner of the image (by using absolute
 * positioning).
 */
export const TrailImageView = ({
	article,
	style,
}: {
	article: CAPIArticle;
	style: StyleProp<{ width?: string; height?: string; marginLeft?: number }>;
}) => {
	const isTablet = useMediaQuery(
		(width) => width >= Breakpoints.TabletVertical,
	);

	const { trailImage: image } = article;
	if (image == null) {
		return null;
	}
	const use: ImageUse =
		'use' in image
			? isTablet
				? image.use.tablet
				: image.use.mobile
			: 'full-size';
	const frameStyle = [trailImageViewStyles.frame, style] as ViewStyle;
	const starRating = article.type === 'article' && article.starRating;
	const sportScore =
		article.articleType === ArticleType.MatchResult && article.sportScore;

	if (starRating) {
		return (
			<View style={frameStyle}>
				<ImageResource
					style={trailImageViewStyles.image}
					image={image}
					use={use}
				/>
				<Stars position="bottomLeft" rating={starRating} />
			</View>
		);
	} else if (sportScore) {
		return (
			<View style={frameStyle}>
				<ImageResource
					style={trailImageViewStyles.image}
					image={image}
					use={use}
				/>
				<SportScore type="trailImage" sportScore={sportScore} />
			</View>
		);
	} else {
		return (
			<ImageResource
				style={frameStyle as StyleProp<ImageStyle>}
				image={image}
				use={use}
			/>
		);
	}
};
