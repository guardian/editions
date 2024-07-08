import { palette } from '@guardian/pasteup/palette';
import { ImageZoom } from '@likashefqet/react-native-image-zoom';
import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import {
	Animated,
	FlatList,
	SafeAreaView,
	StatusBar,
	StyleSheet,
	View,
} from 'react-native';
import { ArticleTheme } from 'src/components/article/article';
import { themeColors } from 'src/components/article/helpers/css';
import {
	getNewWindowStart,
	getWindowStart,
	ProgressIndicator,
} from 'src/components/article/progress-indicator';
import { ButtonAppearance } from 'src/components/Button/Button';
import { CloseButton } from 'src/components/Button/CloseButton';
import { LightboxCaption } from 'src/components/Lightbox/LightboxCaption';
import { clamp } from 'src/helpers/math';
import { getPillarColors } from 'src/helpers/transform';
import { useDimensions } from 'src/hooks/use-config-provider';
import type {
	MainStackParamList,
	RouteNames,
} from 'src/navigation/NavigationModels';

const styles = StyleSheet.create({
	lightboxPage: {
		width: '100%',
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
	},
	background: {
		height: '100%',
		backgroundColor: themeColors(ArticleTheme.Dark).background,
	},
	caption: {
		display: 'flex',
		flexDirection: 'row',
		paddingTop: 5,
		paddingHorizontal: 10,
	},
	imageWrapper: {
		alignSelf: 'center',
		height: '100%',
		width: '100%',
		resizeMode: 'contain',
	},
	captionWrapper: {
		position: 'absolute',
		zIndex: 1,
		opacity: 0.8,
		backgroundColor: themeColors(ArticleTheme.Dark).background,
		bottom: 0,
		width: '100%',
	},
	captionText: {
		color: themeColors(ArticleTheme.Dark).dimText,
		paddingLeft: 2,
		paddingBottom: 50,
	},
	closeButton: {
		position: 'absolute',
		zIndex: 1,
		right: 0,
		paddingVertical: 10,
		paddingHorizontal: 10,
		top: 0,
	},
	progressWrapper: {
		position: 'absolute',
		bottom: 0,
		paddingBottom: 20,
		width: '100%',
		zIndex: 2,
	},
});

const LightboxScreen = () => {
	const navigation =
		useNavigation<NativeStackNavigationProp<MainStackParamList>>();
	const route =
		useRoute<RouteProp<MainStackParamList, RouteNames.Lightbox>>();
	const imagePaths = route.params?.imagePaths ?? [];
	const images = route.params?.images ?? [];
	const index = route.params?.index ?? 0;
	const pillar = route.params?.pillar ?? 'news';
	const numDots = images.length < 6 ? images.length : 6;
	const pillarColors = getPillarColors(pillar);
	const [windowStart, setWindowsStart] = useState(
		getWindowStart(index, numDots, images.length),
	);
	const [currentIndex, setCurrentIndex] = useState(index);

	const [captionVisible, setCaptionVisible] = useState(true);

	const [dotsVisible, setDotsVisible] = useState(true);

	const showProgressIndicator = images.length > 1 ? dotsVisible : false;

	const [closeButtonVisible, setCloseButtonVisible] = useState(true);

	const [scrollInProgress, setScrollInProgress] = useState(false);

	const { width } = useDimensions();

	const [sliderPosition] = useState(new Animated.Value(0));

	const handleScrollStartEvent = useCallback(() => {
		setScrollInProgress(true);
	}, [setScrollInProgress]);

	const focusOnImageComponent = useCallback(() => {
		setCaptionVisible(!captionVisible);
		setDotsVisible(!dotsVisible);
		setCloseButtonVisible(!closeButtonVisible);
	}, [
		setCaptionVisible,
		setDotsVisible,
		setCloseButtonVisible,
		captionVisible,
		dotsVisible,
		closeButtonVisible,
	]);

	const onScrollListener = useCallback(
		(ev: any) => {
			const newPos = ev.nativeEvent.contentOffset.x / width;
			const newIndex = clamp(Math.round(newPos), 0, images.length - 1);
			if (currentIndex !== newIndex) {
				setCurrentIndex(newIndex);
				setWindowsStart(
					getNewWindowStart(
						newIndex,
						windowStart,
						images.length,
						numDots,
					),
				);
			}
		},
		[setCurrentIndex, currentIndex, windowStart, numDots, images.length],
	);

	return (
		<SafeAreaView style={styles.background}>
			<StatusBar hidden={true} />
			<View style={styles.lightboxPage}>
				<View style={styles.closeButton}>
					{closeButtonVisible && (
						<CloseButton
							onPress={() => {
								navigation.goBack();
							}}
							accessibilityLabel="Close Image Gallery"
							accessibilityHint="This will close the Image Gallery which is currently open"
							appearance={ButtonAppearance.Pillar}
							pillar={pillar}
						/>
					)}
				</View>
				<View style={styles.imageWrapper}>
					<FlatList
						initialScrollIndex={index}
						contentContainerStyle={{
							alignItems: 'center',
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
						horizontal
						pagingEnabled
						onScrollBeginDrag={handleScrollStartEvent}
						onScrollEndDrag={() => setScrollInProgress(false)}
						renderItem={({ item }) => {
							console.log(item);
							return (
								<View style={{ width, height: '100%' }}>
									<ImageZoom
										uri={item}
										onSingleTap={focusOnImageComponent}
										isSingleTapEnabled
										isDoubleTapEnabled
									/>
								</View>
							);
						}}
						data={imagePaths}
						getItemLayout={(_, index) => ({
							length: width,
							offset: width * index,
							index,
						})}
						keyExtractor={(item) => item}
					/>

					<View>
						<View style={styles.progressWrapper}>
							{showProgressIndicator && (
								<ProgressIndicator
									currentIndex={currentIndex}
									imageCount={images.length}
									windowSize={numDots}
									windowStart={windowStart}
									scrollInProgress={scrollInProgress}
								/>
							)}
						</View>
						{captionVisible && (
							<LightboxCaption
								caption={images[currentIndex].caption ?? ''}
								pillarColor={
									pillar === 'neutral'
										? palette.neutral[100]
										: pillarColors.bright //bright since always on a dark background
								}
								displayCredit={
									images[currentIndex].displayCredit
								}
								credit={images[currentIndex].credit}
							/>
						)}
					</View>
				</View>
			</View>
		</SafeAreaView>
	);
};

export { LightboxScreen };
