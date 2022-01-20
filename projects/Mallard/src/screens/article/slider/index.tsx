import ViewPagerAndroid from '@react-native-community/viewpager';
import React, { useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { PreviewControls } from 'src/components/article/preview-controls';
import { getColor } from 'src/helpers/transform';
import { getAppearancePillar } from 'src/hooks/use-article';
import { useApiUrl, useDimensions } from 'src/hooks/use-config-provider';
import { useSetNavPosition } from 'src/hooks/use-nav-position';
import type { PathToArticle } from 'src/paths';
import type { ArticleNavigator } from 'src/screens/article-screen';
import { sendPageViewEvent } from 'src/services/ophan';
import { getArticleDataFromNavigator } from '../../article-screen';
import type { OnIsAtTopChange } from '../body';
import { ArticleScreenBody } from '../body';
import { issueDateFromId } from './slider-helpers';
import {
	HEADER_HIGH_END_HEIGHT,
	SliderHeaderHighEnd,
} from './SliderHeaderHighEnd';
import type { SliderSection } from './types';

const styles = StyleSheet.create({
	androidPager: {
		flexGrow: 1,
		width: '100%',
	},
});

/**
 * We keep track of which articles are scrolled or not so that when we swipe
 * left and right we know whether to show a bottom border to the slider.
 */
const useIsAtTop = (currentArticleKey: string): [boolean, OnIsAtTopChange] => {
	const [scrolledSet, setScrolledSet] = useState(new Set());

	const onIsAtTopChange = (isAtTop: boolean, articleKey: string) => {
		if (scrolledSet.has(articleKey) !== isAtTop) return;
		const newSet = new Set(scrolledSet);

		if (isAtTop) newSet.delete(articleKey);
		else newSet.add(articleKey);

		setScrolledSet(newSet);
	};

	const isAtTop = !scrolledSet.has(currentArticleKey);
	return [isAtTop, onIsAtTopChange];
};

const ArticleSlider = React.memo(
	({
		path,
		articleNavigator,
	}: {
		path: PathToArticle;
		articleNavigator: ArticleNavigator;
	}) => {
		const { startingPoint, flattenedArticles } =
			getArticleDataFromNavigator(articleNavigator, path);
		const [current, setCurrent] = useState(startingPoint);
		const [lastTrackedIndex, setLastTrackedIndex] = useState(-1);
		const [position, setPosition] =
			useState<Animated.AnimatedInterpolation>(new Animated.Value(0));

		const { width } = useDimensions();
		const viewPagerRef = useRef<ViewPagerAndroid | null>();

		const { isPreview } = useApiUrl();

		const currentArticle = flattenedArticles[Math.round(current)];

		const sliderSections = articleNavigator.reduce(
			(sectionsWithStartIndex, frontSpec) => {
				const sections = sectionsWithStartIndex.sections.concat({
					items: frontSpec.articleSpecs.length,
					title: frontSpec.frontName,
					color: getColor(frontSpec.appearance),
					startIndex: sectionsWithStartIndex.sectionCounter,
				});
				return {
					sectionCounter:
						sectionsWithStartIndex.sectionCounter +
						frontSpec.articleSpecs.length,
					sections: sections,
				};
			},
			{ sectionCounter: 0, sections: [] as SliderSection[] },
		).sections;

		const getFrontNameAndPosition = () => {
			const displaySection = sliderSections.filter(
				(section) =>
					section.startIndex <= current &&
					section.startIndex + section.items > current,
			);

			return {
				title: displaySection[0].title,
				numOfItems: displaySection[0].items,
				color: displaySection[0].color,
				subtitle: currentArticle.collection,
				startIndex: displaySection[0].startIndex,
				position,
				editionDate: issueDateFromId(path.publishedIssueId),
			};
		};
		const sliderDetails = getFrontNameAndPosition();

		const [shouldShowHeader, onShouldShowHeaderChange] = useState(true);
		const [isAtTop, onIsAtTopChange] = useIsAtTop(currentArticle.article);
		const setNavPosition = useSetNavPosition();

		const scroller = (index: number) =>
			viewPagerRef?.current?.setPage(index);

		const goNext = () => {
			scroller(
				current === flattenedArticles.length - 1
					? flattenedArticles.length - 1
					: current + 1,
			);
		};

		const goPrevious = () => {
			scroller(current === 0 ? 0 : current - 1);
		};

		// Slides the fronts on issue screen in the background
		// if you swipe to new front
		const slideToFrontFor = (newIndex: number) => {
			// Slides the fronts on issue screen in the background if you swipe to new front
			const frontId = flattenedArticles[newIndex].front;
			if (frontId === flattenedArticles[current].front) return;
			setNavPosition({ frontId, articleIndex: 0 });
		};

		return (
			<>
				<ViewPagerAndroid
					style={styles.androidPager}
					initialPage={startingPoint}
					ref={(viewPager) => {
						viewPagerRef.current = viewPager;
					}}
					onPageSelected={(ev: any) => {
						onShouldShowHeaderChange(true);
						const newIndex = ev.nativeEvent.position;
						// onPageSelected get called twice for the first time, to avoid duplicate tracking
						// we are manually checking the last tracked index
						if (lastTrackedIndex != newIndex) {
							sendPageViewEvent({
								path: flattenedArticles[newIndex].article,
							});
							setLastTrackedIndex(newIndex);
						}
						setCurrent(newIndex);
						slideToFrontFor(newIndex);
						setPosition(newIndex);
					}}
				>
					{flattenedArticles.map((item, index) => (
						<View key={index}>
							{index >= current - 1 && index <= current + 1 ? (
								<ArticleScreenBody
									width={width}
									path={item}
									pillar={getAppearancePillar(
										item.appearance,
									)}
									position={index}
									onShouldShowHeaderChange={
										onShouldShowHeaderChange
									}
									shouldShowHeader={shouldShowHeader}
									topPadding={HEADER_HIGH_END_HEIGHT}
									onIsAtTopChange={onIsAtTopChange}
								/>
							) : null}
						</View>
					))}
				</ViewPagerAndroid>

				<SliderHeaderHighEnd
					isShown={shouldShowHeader}
					isAtTop={isAtTop}
					sliderDetails={sliderDetails}
				/>

				{isPreview && (
					<PreviewControls goNext={goNext} goPrevious={goPrevious} />
				)}
			</>
		);
	},
);

export { ArticleSlider };
