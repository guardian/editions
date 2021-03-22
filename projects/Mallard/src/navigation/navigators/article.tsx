import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import type { NavigationRouteConfig } from 'react-navigation';
import { safeInterpolation } from 'src/helpers/math';
import { ArticleScreen } from 'src/screens/article-screen';
import { color } from 'src/theme/color';
import { metrics } from 'src/theme/spacing';
import { SlideCard } from '../../components/layout/slide-card/index';

const styles = StyleSheet.create({
	root: {
		...StyleSheet.absoluteFillObject,
	},
	inner: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: color.background,
		height: '100%',
		flexGrow: 1,
		overflow: 'hidden',
		marginBottom: metrics.slideCardSpacing,
	},
	basicCard: { backgroundColor: color.background, overflow: 'hidden' },
});

export const ArticleWrapper = ({ route }: NavigationRouteConfig) => {
	const position = new Animated.Value(0);
	if (route.params.prefersFullScreen) {
		return (
			<Animated.View
				style={[
					StyleSheet.absoluteFillObject,
					styles.basicCard,
					{
						transform: [
							{
								translateY: position.interpolate({
									inputRange: safeInterpolation([0, 1]),
									outputRange: safeInterpolation([200, 0]),
								}),
							},
						],
					},
					{
						opacity: position.interpolate({
							inputRange: safeInterpolation([0, 0.5]),
							outputRange: safeInterpolation([0, 1]),
						}),
					},
				]}
			></Animated.View>
		);
	}
	return (
		<SlideCard>
			<ArticleScreen route={route} />
		</SlideCard>
	);
};

// export { createArticleNavigator };
