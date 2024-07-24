import { palette } from '@guardian/pasteup/palette';
import { ImageZoom } from '@likashefqet/react-native-image-zoom';
import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useRef, useState } from 'react';
import { Animated, FlatList, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArticleTheme } from '../components/article/article';
import { themeColors } from '../components/article/helpers/css';
import {
	getNewWindowStart,
	getWindowStart,
	ProgressIndicator,
} from '../components/article/progress-indicator';
import { ButtonAppearance } from '../components/Button/Button';
import { CloseButton } from '../components/Button/CloseButton';
import { LightboxCaption } from '../components/Lightbox/LightboxCaption';
import { clamp } from '../helpers/math';
import { getPillarColors } from '../helpers/transform';
import { useDimensions } from '../hooks/use-config-provider';
import type {
	MainStackParamList,
	RouteNames,
} from '../navigation/NavigationModels';

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

	const showProgressIndicator = images.length > 1;

	const [showControls, setShowControls] = useState(true);

	const [scrollInProgress, setScrollInProgress] = useState(false);

	const { width } = useDimensions();

	const sliderPosition = useRef(new Animated.Value(0)).current;

	const fadeAnim = useRef(new Animated.Value(1)).current;

	const toggleControls = useCallback(
		(toggle: boolean) => {
			if (toggle) {
				Animated.timing(fadeAnim, {
					toValue: 1,
					duration: 100,
					useNativeDriver: true,
				}).start();
			} else {
				Animated.timing(fadeAnim, {
					toValue: 0,
					duration: 100,
					useNativeDriver: true,
				}).start();
			}
			setShowControls(toggle);
		},
		[fadeAnim],
	);

	const handleScrollStartEvent = useCallback(() => {
		setScrollInProgress(true);
	}, [setScrollInProgress]);

	const focusOnImageComponent = useCallback(() => {
		toggleControls(!showControls);
	}, [toggleControls, showControls]);

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
					<Animated.View style={{ opacity: fadeAnim }}>
						<CloseButton
							onPress={() => {
								showControls && navigation.goBack();
							}}
							accessibilityLabel="Close Image Gallery"
							accessibilityHint="This will close the Image Gallery which is currently open"
							appearance={ButtonAppearance.Pillar}
							pillar={pillar}
						/>
					</Animated.View>
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
								<Animated.View style={{ opacity: fadeAnim }}>
									<ProgressIndicator
										currentIndex={currentIndex}
										imageCount={images.length}
										windowSize={numDots}
										windowStart={windowStart}
										scrollInProgress={scrollInProgress}
									/>
								</Animated.View>
							)}
						</View>
						<Animated.View style={{ opacity: fadeAnim }}>
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
						</Animated.View>
					</View>
				</View>
			</View>
		</SafeAreaView>
	);
};

export { LightboxScreen };
