import React, { useCallback, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import type { ArticlePillar, Front as FrontType, Issue } from 'src/common';
import { ArticleType } from 'src/common';
import { clamp } from 'src/helpers/math';
import type { FlatCard } from 'src/helpers/transform';
import { getColor } from 'src/helpers/transform';
import { useLargeDeviceMemory } from 'src/hooks/use-config-provider';
import type { ArticleNavigator } from 'src/screens/article-screen';
import { issueDateFromId } from 'src/screens/article/slider/slider-helpers';
import { SliderTitle } from 'src/screens/article/slider/SliderTitle';
import { useIssueScreenSize } from 'src/screens/issue/use-size';
import {
	getAppearancePillar,
	getCollectionPillarOverride,
	WithArticle,
} from '../../hooks/use-article';
import type { PropTypes } from './collection-page';
import { CollectionPage } from './collection-page';
import { FrontWrapper } from './helpers/front-wrapper';

const CollectionPageInFront = React.memo(
	({
		pillar,
		width,
		...collectionPageProps
	}: {
		width: Number;
		pillar: ArticlePillar;
	} & PropTypes) => (
		<View
			style={{
				width,
			}}
		>
			<WithArticle
				type={ArticleType.Article}
				pillar={getCollectionPillarOverride(
					pillar,
					collectionPageProps.collection,
				)}
			>
				<CollectionPage {...collectionPageProps} width={width} />
			</WithArticle>
		</View>
	),
);

const styles = StyleSheet.create({ overflow: { overflow: 'hidden' } });

export const Front = React.memo(
	({
		articleNavigator,
		frontData,
		localIssueId,
		publishedIssueId,
		cards,
	}: {
		articleNavigator: ArticleNavigator;
		localIssueId: Issue['localId'];
		publishedIssueId: Issue['publishedId'];
		frontData: FrontType;
		cards: FlatCard[];
	}) => {
		const color = getColor(frontData.appearance);
		const pillar = getAppearancePillar(frontData.appearance);

		const [scrollX] = useState(() => new Animated.Value(0));

		const stops = cards.length;
		const { card, container } = useIssueScreenSize();
		const largeDeviceMemory = useLargeDeviceMemory();
		const flatListOptimisationProps = largeDeviceMemory
			? {
					windowSize: 3,
					maxToRenderPerBatch: 2,
					initialNumToRender: 3,
			  }
			: {
					windowSize: 2,
					maxToRenderPerBatch: 1,
					initialNumToRender: 2,
			  };

		const [cardIndex, setCardIndex] = useState(0);
		const [position, setPosition] =
			useState<Animated.AnimatedInterpolation>(new Animated.Value(0));

		const renderItem = useCallback(
			({ item }: { item: FlatCard }) => (
				<CollectionPageInFront
					articlesInCard={item.articles || []}
					appearance={item.appearance}
					collection={item.collection.key}
					front={frontData.key}
					width={card.width}
					{...{
						localIssueId,
						publishedIssueId,
						pillar,
						articleNavigator,
					}}
				/>
			),
			[
				card.width,
				frontData.key,
				localIssueId,
				publishedIssueId,
				pillar,
				articleNavigator,
			],
		);

		const ListFooterComponent = React.memo(() => (
			<View
				style={{
					width: container.width - card.width,
				}}
			></View>
		));

		const getItemLayout = (_: never, index: number) => ({
			length: card.width,
			offset: card.width * index,
			index,
		});

		const onScroll = Animated.event(
			[
				{
					nativeEvent: {
						contentOffset: { x: scrollX },
					},
				},
			],
			{
				useNativeDriver: true,
				listener: (ev: any) => {
					const pos = ev.nativeEvent.contentOffset.x / card.width;

					const slideIndex = clamp(Math.ceil(pos), 0, stops);
					// Prevent the index being greater than the stops due to flatlist bounce
					const index =
						slideIndex >= stops - 1 ? stops - 1 : slideIndex;
					setCardIndex(index);

					const position = Animated.divide(
						ev.nativeEvent.contentOffset.x,
						new Animated.Value(card.width),
					);
					setPosition(position);
				},
			},
		);

		return (
			<FrontWrapper
				scrubber={
					<SliderTitle
						title={frontData.displayName ?? 'News'}
						numOfItems={stops}
						color={color}
						location="front"
						subtitle={cards[cardIndex]?.collection?.key}
						position={position}
						editionDate={issueDateFromId(publishedIssueId)}
					/>
				}
			>
				<Animated.FlatList
					showsHorizontalScrollIndicator={false}
					// These three props are responsible for the majority of
					// performance improvements
					{...flatListOptimisationProps}
					showsVerticalScrollIndicator={false}
					scrollEventThrottle={1}
					horizontal={true}
					style={styles.overflow}
					pagingEnabled={true}
					decelerationRate="fast"
					snapToInterval={card.width}
					getItemLayout={getItemLayout}
					keyExtractor={(item: FlatCard, index: number) =>
						`${index}${item.collection.key}`
					}
					ListFooterComponent={ListFooterComponent}
					onScroll={onScroll}
					// this needs to be referential equal or will trigger
					// a re-render
					extraData={`${container.width}:${container.height}`}
					data={cards}
					renderItem={renderItem}
				/>
			</FrontWrapper>
		);
	},
);
