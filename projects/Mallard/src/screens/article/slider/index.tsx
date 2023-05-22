import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, FlatList, Platform, StyleSheet, View } from 'react-native';
import ViewPagerAndroid from 'react-native-pager-view';
import { PreviewControls } from 'src/components/article/preview-controls';
import { logPageView } from 'src/helpers/analytics';
import { clamp } from 'src/helpers/math';
import { getColor } from 'src/helpers/transform';
import { getAppearancePillar } from 'src/hooks/use-article';
import {
	useApiUrl,
	useDimensions,
	useLargeDeviceMemory,
} from 'src/hooks/use-config-provider';
import { useSetNavPosition } from 'src/hooks/use-nav-position';
import { useRating } from 'src/hooks/use-rating';
import type { PathToArticle } from 'src/paths';
import type { ArticleNavigator, ArticleSpec } from 'src/screens/article-screen';
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
		const [position, setPosition] = useState<number>(startingPoint);
		const [sliderPosition] = useState(new Animated.Value(0));

		const { width } = useDimensions();
		const viewPagerRef = useRef<ViewPagerAndroid | null>();
		const flatListRef = useRef<any | undefined>();
		const { interaction, hasShownRating } = useRating();
		const { isPreview } = useApiUrl();
		const hasLargeMemory = useLargeDeviceMemory();

		// Set an interaction on mount of the first article
		// Have to wait for a change in hasShownRating as its async
		// Otherwise it doesnt fire.
		useEffect(() => {
			!hasShownRating && interaction();
		}, [hasShownRating]);

		const currentArticle = flattenedArticles[Math.round(current)];

		useEffect(() => {
			if (Platform.OS === 'ios') {
				flatListRef?.current?.scrollToIndex({
					index: current,
					animated: false,
				});
			} else {
				viewPagerRef?.current?.setPage(startingPoint);
			}
		}, [width]); // eslint-disable-line react-hooks/exhaustive-deps

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

		const scroller = (index: number) => {
			if (Platform.OS === 'ios') {
				flatListRef?.current?.scrollToIndex({
					index,
					animated: true,
				});
			} else {
				viewPagerRef?.current?.setPage(index);
			}
		};

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

		const renderItem = useCallback(
			({ item, index }: { item: ArticleSpec; index: number }) => (
				<ArticleScreenBody
					width={width}
					path={item}
					pillar={getAppearancePillar(item.appearance)}
					position={index}
					onShouldShowHeaderChange={onShouldShowHeaderChange}
					shouldShowHeader={shouldShowHeader}
					topPadding={HEADER_HIGH_END_HEIGHT}
					onIsAtTopChange={onIsAtTopChange}
				/>
			),
			[
				width,
				onShouldShowHeaderChange,
				shouldShowHeader,
				HEADER_HIGH_END_HEIGHT,
				onIsAtTopChange,
			],
		);

		const onScrollListener = (ev: any) => {
			onShouldShowHeaderChange(true);
			const newPos = ev.nativeEvent.contentOffset.x / width;
			const newIndex = clamp(
				Math.round(newPos),
				0,
				flattenedArticles.length - 1,
			);
			if (current !== newIndex) {
				setCurrent(newIndex);
				slideToFrontFor(newIndex);
				setPosition(newIndex);
				// Adds an interaction for the rating
				interaction();
			}
		};

		return (
			<>
				{Platform.OS === 'ios' && hasLargeMemory ? (
					<View style={styles.androidPager}>
						<FlatList
							style={{ paddingBottom: isPreview ? 150 : 0 }}
							windowSize={3}
							initialNumToRender={3}
							maxToRenderPerBatch={6}
							ref={(flatList: any) =>
								(flatListRef.current = flatList)
							}
							decelerationRate="fast"
							showsHorizontalScrollIndicator={false}
							showsVerticalScrollIndicator={false}
							scrollEventThrottle={1}
							onMomentumScrollEnd={() => {
								logPageView(flattenedArticles[current].article);
							}}
							onScroll={Animated.event(
								[
									{
										nativeEvent: {
											contentOffset: {
												x: sliderPosition,
											},
										},
									},
								],
								{
									useNativeDriver: false,
									listener: onScrollListener,
								},
							)}
							getItemLayout={(
								_: ArticleSpec[] | null | undefined,
								index: number,
							) => ({
								length: width,
								offset: width * index,
								index,
							})}
							horizontal={true}
							initialScrollIndex={startingPoint}
							pagingEnabled
							keyExtractor={(item: any) => item.article}
							data={flattenedArticles}
							renderItem={renderItem}
						/>
					</View>
				) : (
					<ViewPagerAndroid
						style={[
							styles.androidPager,
							{ marginBottom: isPreview ? 100 : 0 },
						]}
						initialPage={startingPoint}
						ref={(viewPager) => {
							viewPagerRef.current = viewPager;
						}}
						scrollSensitivity={5}
						onPageSelected={(ev: any) => {
							// ev.position.newIndex gives 0 even if its not. This is intermittent.
							// This is explained here: https://github.com/callstack/react-native-pager-view/issues/650
							// This forces the very first article chosen to be set in the slider for Android only
							if (lastTrackedIndex === -1) {
								viewPagerRef?.current?.setPageWithoutAnimation(
									startingPoint,
								);
							}

							onShouldShowHeaderChange(true);
							const newIndex = ev.nativeEvent.position;
							// onPageSelected get called twice for the first time, to avoid duplicate tracking
							// we are manually checking the last tracked index
							if (lastTrackedIndex != newIndex) {
								logPageView(
									flattenedArticles[newIndex].article,
								);
								setLastTrackedIndex(newIndex);
							}
							setCurrent(newIndex);
							slideToFrontFor(newIndex);
							setPosition(newIndex);
							// Adds an interaction for the rating
							interaction();
						}}
					>
						{flattenedArticles.map((item, index) => (
							<View key={index}>
								{index >= current - 1 &&
								index <= current + 1 ? (
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
				)}
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
