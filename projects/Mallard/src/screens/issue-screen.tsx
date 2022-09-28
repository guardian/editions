import { useNavigation, useRoute } from '@react-navigation/native';
import type { MutableRefObject, ReactElement } from 'react';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { FlatList, Image, StyleSheet, View } from 'react-native';
import RNRestart from 'react-native-restart';
import { PageLayoutSizes } from 'src/common';
import { ReloadButton } from 'src/components/Button/ReloadButton';
import { Front } from 'src/components/front';
import { FlexCenter } from 'src/components/layout/flex-center';
import { Container } from 'src/components/layout/ui/container';
import { FlexErrorMessage } from 'src/components/layout/ui/errors/flex-error-message';
import { WithBreakpoints } from 'src/components/layout/ui/sizing/with-breakpoints';
import { WithLayoutRectangle } from 'src/components/layout/ui/sizing/with-layout-rectangle';
import { NewEditionCard } from 'src/components/onboarding/new-edition';
import { IssueScreenHeader } from 'src/components/ScreenHeader/IssueScreenHeader/IssueScreenHeader';
import { Spinner } from 'src/components/Spinner/Spinner';
import {
	EMPTY_WEATHER_HEIGHT,
	WEATHER_HEIGHT,
	WeatherWidget,
} from 'src/components/weather';
import { deleteIssueFiles } from 'src/download-edition/clear-issues-and-editions';
import type { FlatCard } from 'src/helpers/transform';
import {
	flattenCollectionsToCards,
	flattenFlatCardsToFront,
} from 'src/helpers/transform';
import {
	CONNECTION_FAILED_ERROR,
	CONNECTION_FAILED_SUB_ERROR,
	NewEditionWords,
	REFRESH_BUTTON_TEXT,
} from 'src/helpers/words';
import {
	useApiUrl,
	useDimensions,
	useLargeDeviceMemory,
} from 'src/hooks/use-config-provider';
import {
	BASE_EDITION,
	getSpecialEditionProps,
	useEditions,
} from 'src/hooks/use-edition-provider';
import type { IssueState } from 'src/hooks/use-issue-provider';
import { useIssue } from 'src/hooks/use-issue-provider';
import { useIssueSummary } from 'src/hooks/use-issue-summary-provider';
import { useNavPositionChange } from 'src/hooks/use-nav-position';
import { useWeather } from 'src/hooks/use-weather-provider';
import { SLIDER_FRONT_HEIGHT } from 'src/screens/article/slider/SliderTitle';
import { sendPageViewEvent } from 'src/services/ophan';
import { Breakpoints } from 'src/theme/breakpoints';
import { metrics } from 'src/theme/spacing';
import type {
	IssueWithFronts,
	SpecialEditionHeaderStyles,
	Front as TFront,
} from '../../../Apps/common/src';
import type { FrontSpec } from './article-screen';
import { useIssueScreenSize, WithIssueScreenSize } from './issue/use-size';

const styles = StyleSheet.create({
	emptyWeatherSpace: {
		height: EMPTY_WEATHER_HEIGHT,
	},
	illustrationImage: {
		width: '100%',
		height: 100,
	},
	illustrationPosition: {
		position: 'relative',
		bottom: 0,
		left: 0,
		height: '15%',
		right: 0,
	},
});

type FrontWithCards = Array<TFront & { cards: FlatCard[] }>;

/**
 * Implement the mechanism that allows scrolling to a particular Front. This
 * happens in two cases:
 *
 *   1. when opening a Front from the Editions list and that particular edition
 *      is already shown, then we just need to scroll to the right place;
 *   2. when opening a Front and the edition is not shown yet, then we need to
 *      scroll after the edition got loaded.
 *
 * Case (1) also occurs when we slide from article to article and we happen to
 * change Front doing so. When that happens, we scroll to the right Front in the
 * background.
 */
const useScrollToFrontBehavior = (
	frontWithCards: FrontWithCards,
	initialFrontKey: string | null,
	ref: MutableRefObject<FlatList | null>,
) => {
	// Linear search to find the right index to scroll to, front count is bound.
	const findFrontIndex = (frontKey: string | null | undefined) =>
		frontWithCards.findIndex((front) => front.key === frontKey);

	// Helper to scroll to a particular Front index. When the front is not
	// specified we default to scrolling to the very top (ex. weather). This
	// happens for example when pressing an issue title twice, in which case we
	// assume the reader wants to see everything from the start. We don't use
	// animations because these will happen in the background, after pressing an
	// item on the Editions list.
	const scrollTo = (scrollIndex: number) => {
		if (!ref?.current?.scrollToOffset) return;

		if (scrollIndex < 0) {
			ref.current.scrollToOffset({ animated: false, offset: 0 });
			return;
		}

		ref.current.scrollToIndex({
			animated: false,
			index: scrollIndex,
			viewOffset: metrics.vertical,
		});
	};

	// Case (1). We listen to the "nav position" handler and navigate to
	// whichever front is requested.
	useNavPositionChange(
		(position) => scrollTo(findFrontIndex(position?.frontId)),
		[frontWithCards],
	);

	// Case (2), if `frontWithCards` changes it means the issue being shown just
	// changed. In that case we want to reset the scroll position to the
	// "initial" Front, information that's provided upstream by the issue
	// summary store close to the current issue ID. We disable the lint rule
	// because we want to run this side-effect only when `frontWithCards`
	// changes and nothing else.
	//

	useEffect(
		() => scrollTo(findFrontIndex(initialFrontKey)),
		[frontWithCards],
	);
};

const IssueFronts = ({
	issue,
	ListHeaderComponent,
	style,
	initialFrontKey,
}: {
	issue: IssueWithFronts;
	ListHeaderComponent?: ReactElement;
	style?: StyleProp<ViewStyle>;
	initialFrontKey: string | null;
}) => {
	const { container, card } = useIssueScreenSize();
	const { width } = useDimensions();
	const ref = useRef<FlatList | null>(null);
	const { selectedEdition } = useEditions();
	const { isPreview } = useApiUrl();
	const weatherResult = useWeather();

	const useIsWeatherActuallyShown =
		weatherResult.isWeatherShown &&
		weatherResult.lastUpdated !== 0 &&
		weatherResult.forecasts.length >= 9;

	const issueToFronts: () => {
		frontWithCards: FrontWithCards;
		frontSpecs: FrontSpec[];
	} = () =>
		issue.fronts.reduce<{
			frontWithCards: Array<TFront & { cards: FlatCard[] }>;
			frontSpecs: FrontSpec[];
		}>(
			(acc, front) => {
				const flatCollections = flattenCollectionsToCards(
					front.collections,
				);
				acc.frontWithCards.push({
					...front,
					cards: flatCollections,
				});
				const specs = flattenFlatCardsToFront(flatCollections)
					// Exlude crosswords because we don't want to be able to
					// "slide" onto them.
					.filter(({ article }) => article.type !== 'crossword')
					.map(({ article, collection }) => ({
						collection: collection.key,
						front: front.key,
						article: article.key,
						localIssueId: issue.localId,
						publishedIssueId: issue.publishedId,
					}));
				if (specs.length > 0) {
					acc.frontSpecs.push({
						appearance: front.appearance,
						frontName: front.displayName ?? '',
						articleSpecs: specs,
					});
				}
				return acc;
			},
			{
				frontWithCards: [],
				frontSpecs: [],
			},
		);

	const memoisedIssueToFronts = useMemo(
		() => issueToFronts(),
		[issue.localId, issue.publishedId, issue.fronts[0].id],
	);

	const { frontWithCards, frontSpecs } = isPreview
		? issueToFronts()
		: memoisedIssueToFronts;

	useScrollToFrontBehavior(frontWithCards, initialFrontKey, ref);
	const largeDeviceMemory = useLargeDeviceMemory();
	const flatListOptimisationProps = !largeDeviceMemory && {
		initialNumToRender: 2,
		windowSize: 1,
		maxToRenderPerBatch: 1,
	};

	const renderItem = useCallback(
		({ item }: { item: any }) =>
			item.cards.length > 0 ? (
				<Front
					localIssueId={issue.localId}
					publishedIssueId={issue.publishedId}
					articleNavigator={frontSpecs}
					frontData={item}
					cards={item.cards}
					key={item.key}
				/>
			) : null,
		[frontSpecs, issue.localId, issue.publishedId],
	);

	const FooterComponent = React.memo(() => (
		<>
			<View style={[styles.illustrationPosition]}>
				{selectedEdition &&
					selectedEdition.edition === BASE_EDITION.edition && (
						<Image
							style={styles.illustrationImage}
							resizeMode={'contain'}
							source={require('src/assets/images/privacy.png')}
						/>
					)}
			</View>
			<View style={{ height: container.height / 3 }} />
		</>
	));

	const getItemLayout = (_: any, index: number) => ({
		length: card.height + SLIDER_FRONT_HEIGHT,
		offset:
			(card.height + SLIDER_FRONT_HEIGHT) * index +
			(useIsWeatherActuallyShown ? WEATHER_HEIGHT : EMPTY_WEATHER_HEIGHT),
		index,
	});

	/* setting a key will force a rerender on rotation, removing 1000s of layout bugs */
	return (
		<FlatList
			ref={(r) => (ref.current = r)}
			showsHorizontalScrollIndicator={false}
			ListHeaderComponent={ListHeaderComponent}
			// These three props are responsible for the majority of
			// performance improvements
			{...flatListOptimisationProps}
			showsVerticalScrollIndicator={false}
			scrollEventThrottle={1}
			ListFooterComponent={FooterComponent}
			getItemLayout={getItemLayout}
			keyExtractor={(item) => item.key}
			data={frontWithCards}
			style={style}
			key={width}
			renderItem={renderItem}
		/>
	);
};

const PreviewReloadButton = ({ onPress }: { onPress: () => Promise<void> }) => {
	const { isPreview } = useApiUrl();
	const navigation = useNavigation();
	const route = useRoute();

	const onPressReload = async () => {
		await onPress();
		navigation.navigate(route);
	};
	return isPreview ? <ReloadButton onPress={onPressReload} /> : null;
};

const IssueScreenWithPathError = ({
	headerStyle,
	message,
	retry,
}: {
	headerStyle?: SpecialEditionHeaderStyles;
	message: string;
	retry: () => void;
}) => (
	<>
		<IssueScreenHeader headerStyles={headerStyle} />

		<FlexErrorMessage
			debugMessage={message}
			title={CONNECTION_FAILED_ERROR}
			message={CONNECTION_FAILED_SUB_ERROR}
			action={[REFRESH_BUTTON_TEXT, retry]}
		/>
	</>
);

const IssueScreenWithPathPending = ({
	headerStyle,
}: {
	headerStyle?: SpecialEditionHeaderStyles;
}) => (
	<>
		<IssueScreenHeader headerStyles={headerStyle} />
		<FlexCenter>
			<Spinner />
		</FlexCenter>
	</>
);

const WeatherHeader = () => {
	const { isWeatherShown } = useWeather();

	if (!isWeatherShown) {
		return <View style={styles.emptyWeatherSpace} />;
	}

	return <WeatherWidget />;
};

const IssueScreenWithPath = ({
	issue,
	retry,
	headerStyle,
}: {
	issue: IssueWithFronts;
	retry: IssueState['retry'];
	headerStyle: SpecialEditionHeaderStyles | undefined;
}) => {
	const { isProof } = useApiUrl();
	const { initialFrontKey } = useIssueSummary();

	useEffect(() => {
		issue &&
			sendPageViewEvent({
				path: `editions/${issue.key}`,
			});
	}, [issue?.key]);

	return (
		<>
			<PreviewReloadButton
				onPress={async () => {
					if (isProof) {
						try {
							await deleteIssueFiles();
						} catch (error) {
							console.error('failed to delete files', error);
						} finally {
							RNRestart.Restart();
						}
					}
					await retry();
				}}
			/>
			<IssueScreenHeader issue={issue} headerStyles={headerStyle} />

			<WithBreakpoints>
				{{
					0: () => (
						<WithLayoutRectangle>
							{(metrics) => (
								<WithIssueScreenSize
									value={[PageLayoutSizes.mobile, metrics]}
								>
									<IssueFronts
										ListHeaderComponent={<WeatherHeader />}
										issue={issue}
										initialFrontKey={initialFrontKey}
									/>
								</WithIssueScreenSize>
							)}
						</WithLayoutRectangle>
					),
					[Breakpoints.TabletVertical]: () => (
						<View
							style={{
								flexDirection: 'row',
							}}
						>
							<WithLayoutRectangle>
								{(metrics) => (
									<WithIssueScreenSize
										value={[
											PageLayoutSizes.tablet,
											metrics,
										]}
									>
										<IssueFronts
											ListHeaderComponent={
												<WeatherHeader />
											}
											issue={issue}
											initialFrontKey={initialFrontKey}
										/>
									</WithIssueScreenSize>
								)}
							</WithLayoutRectangle>
						</View>
					),
				}}
			</WithBreakpoints>
		</>
	);
};

export const IssueScreen = React.memo(() => {
	const { showNewEditionCard, setNewEditionSeen } = useEditions();
	const { issueWithFronts: issue, error, retry } = useIssue();
	const { selectedEdition } = useEditions();
	const specialEditionProps = getSpecialEditionProps(selectedEdition);
	const headerStyle = specialEditionProps?.headerStyle;

	return (
		<Container>
			{showNewEditionCard && (
				<NewEditionCard
					modalText={NewEditionWords}
					onDismissThisCard={setNewEditionSeen}
				/>
			)}
			{issue ? (
				<IssueScreenWithPath
					issue={issue}
					headerStyle={headerStyle}
					retry={retry}
				/>
			) : error ? (
				<IssueScreenWithPathError
					headerStyle={headerStyle}
					message={error}
					retry={retry}
				/>
			) : (
				<IssueScreenWithPathPending headerStyle={headerStyle} />
			)}
		</Container>
	);
});
