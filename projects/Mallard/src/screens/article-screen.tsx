import type { RouteProp } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import type { Appearance } from '../common';
import { FlexErrorMessage } from '../components/layout/ui/errors/flex-error-message';
import { ERR_404_MISSING_PROPS } from '../helpers/words';
import { getAppearancePillar } from '../hooks/use-article';
import { useDimensions } from '../hooks/use-config-provider';
import { useLoginOverlay } from '../hooks/use-login-overlay';
import type { ArticleNavigationProps } from '../navigation/helpers/base';
import { getArticleNavigationProps } from '../navigation/helpers/base';
import type { MainStackParamList } from '../navigation/NavigationModels';
import type { PathToArticle } from '../paths';
import { color } from '../theme/color';
import { ArticleScreenBody } from './article/body';
import { ArticleSlider } from './article/slider';

export type FrontSpec = {
	frontName: string;
	appearance: Appearance;
	articleSpecs: PathToArticle[];
};

export type ArticleSpec = PathToArticle & {
	frontName: string;
	appearance: Appearance;
};

export type ArticleNavigator = FrontSpec[];

// THIS SEEMS USEFUL
export const getArticleDataFromNavigator = (
	navigator: ArticleNavigator,
	currentArticle: PathToArticle,
): {
	startingPoint: number;
	appearance: Appearance;
	frontName: string;
	flattenedArticles: ArticleSpec[];
} => {
	const flattenedArticles: ArticleSpec[] = [];
	navigator.forEach((frontSpec) =>
		frontSpec.articleSpecs.forEach((as) =>
			flattenedArticles.push({
				...as,
				appearance: frontSpec.appearance,
				frontName: frontSpec.frontName,
			}),
		),
	);

	const startingPoint = flattenedArticles.findIndex(
		({ article, front }) =>
			currentArticle.article === article &&
			currentArticle.front === front,
	);
	if (startingPoint < 0) {
		return {
			startingPoint: 0,
			appearance: { type: 'pillar', name: 'neutral' } as const,
			frontName: '',
			flattenedArticles: [
				{
					...currentArticle,
					appearance: { type: 'pillar', name: 'neutral' } as const,
					frontName: '',
				},
				...flattenedArticles,
			],
		};
	}
	return {
		startingPoint,
		appearance: flattenedArticles[startingPoint].appearance,
		frontName: flattenedArticles[startingPoint].frontName,
		flattenedArticles,
	};
};

const styles = StyleSheet.create({
	refView: { flex: 1 },
});

const ArticleScreenWithProps = ({
	path,
	articleNavigator,
	prefersFullScreen,
}: Required<ArticleNavigationProps> & {}) => {
	useLoginOverlay();
	const current = getArticleDataFromNavigator(articleNavigator, path);
	// TODO use `getData` for this
	const pillar = getAppearancePillar(current.appearance);
	const viewRef = useRef<View>();
	const { width } = useDimensions();
	useEffect(() => {
		if (viewRef.current) {
			viewRef.current.setNativeProps({ opacity: 0 });
			setTimeout(() => {
				viewRef?.current?.setNativeProps({ opacity: 1 });
			}, 600);
		}
	}, [width]);
	return (
		<View
			style={styles.refView}
			ref={(r) => {
				if (r) viewRef.current = r;
			}}
		>
			{prefersFullScreen ? (
				<>
					<ArticleScreenBody
						path={path}
						width={width}
						pillar={pillar}
						onShouldShowHeaderChange={() => {}}
						shouldShowHeader={true}
						topPadding={0}
					/>
				</>
			) : (
				<ArticleSlider
					path={path}
					articleNavigator={articleNavigator}
				/>
			)}
		</View>
	);
};

export const ArticleScreen = () => {
	const route = useRoute<RouteProp<MainStackParamList, 'Article'>>();
	return getArticleNavigationProps(route.params, {
		error: () => (
			<FlexErrorMessage
				title={ERR_404_MISSING_PROPS}
				style={{ backgroundColor: color.background }}
			/>
		),
		success: (props) => {
			return <ArticleScreenWithProps {...props} />;
		},
	});
};
