import React, { useMemo, useRef, useState } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import {
    ArticlePillar,
    ArticleType,
    Front as FrontType,
    Issue,
    PageLayoutSizes,
} from 'src/common'
import { clamp } from 'src/helpers/math'
import { FlatCard, getColor } from 'src/helpers/transform'
import { useIssueScreenSize } from 'src/screens/issue/use-size'
import {
    getAppearancePillar,
    getCollectionPillarOverride,
    WithArticle,
} from '../../hooks/use-article'
import { CollectionPage, PropTypes } from './collection-page'
import { AnimatedFlatListRef, getTranslateForPage } from './helpers/helpers'
import { Wrapper } from './helpers/wrapper'
import { ArticleNavigator } from 'src/screens/article-screen'
import { useLargeDeviceMemory } from 'src/hooks/use-config-provider'
import { SliderTitle } from 'src/screens/article/slider/SliderTitle'

const CollectionPageInFront = ({
    index,
    pillar,
    scrollX,
    ...collectionPageProps
}: {
    index: number
    pillar: ArticlePillar
    scrollX: Animated.Value
} & PropTypes) => {
    const { card, size } = useIssueScreenSize()
    const translate = useMemo(
        () =>
            getTranslateForPage(
                card.width,
                scrollX,
                index,
                size === PageLayoutSizes.mobile ? 1 : 0.5,
            ),
        [card.width, scrollX, index, size],
    )
    return (
        <Animated.View
            style={[
                {
                    width: card.width,
                },
                {
                    transform: [
                        {
                            translateX: translate,
                        },
                    ],
                },
            ]}
        >
            <WithArticle
                type={ArticleType.Article}
                pillar={getCollectionPillarOverride(
                    pillar,
                    collectionPageProps.collection,
                )}
            >
                <CollectionPage
                    translate={translate}
                    {...collectionPageProps}
                />
            </WithArticle>
        </Animated.View>
    )
}

const styles = StyleSheet.create({ overflow: { overflow: 'hidden' } })

export const Front = React.memo(
    ({
        articleNavigator,
        frontData,
        localIssueId,
        publishedIssueId,
        cards,
    }: {
        articleNavigator: ArticleNavigator
        localIssueId: Issue['localId']
        publishedIssueId: Issue['publishedId']
        frontData: FrontType
        cards: FlatCard[]
    }) => {
        const color = getColor(frontData.appearance)
        const pillar = getAppearancePillar(frontData.appearance)

        const [scrollX] = useState(() => new Animated.Value(0))
        const flatListRef = useRef<AnimatedFlatListRef | undefined>()

        const stops = cards.length
        const { card, container } = useIssueScreenSize()
        const largeDeviceMemory = useLargeDeviceMemory()
        const flatListOptimisationProps = !largeDeviceMemory && {
            windowSize: 2,
            maxToRenderPerBatch: 1,
            initialNumToRender: 2,
        }

        const [cardIndex, setCardIndex] = useState(0)
        const [position, setPosition] = useState<
            Animated.AnimatedInterpolation
        >(new Animated.Value(0))

        return (
            <Wrapper
                scrubber={
                    <SliderTitle
                        title={frontData.displayName || 'News'}
                        numOfItems={stops}
                        color={color}
                        location="front"
                        subtitle={
                            cards[cardIndex] &&
                            cards[cardIndex].collection &&
                            cards[cardIndex].collection.key
                        }
                        position={position}
                    />
                }
            >
                <Animated.FlatList
                    showsHorizontalScrollIndicator={false}
                    // These three props are responsible for the majority of
                    // performance improvements
                    initialNumToRender={2}
                    {...flatListOptimisationProps}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={1}
                    horizontal={true}
                    style={styles.overflow}
                    pagingEnabled={true}
                    decelerationRate="fast"
                    snapToInterval={card.width}
                    ref={flatListRef}
                    getItemLayout={(_: never, index: number) => ({
                        length: card.width,
                        offset: card.width * index,
                        index,
                    })}
                    keyExtractor={(item: FlatCard, index: number) =>
                        index + item.collection.key
                    }
                    ListFooterComponent={
                        <View
                            style={{
                                width: container.width - card.width,
                            }}
                        ></View>
                    }
                    onScroll={Animated.event(
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
                                const pos =
                                    ev.nativeEvent.contentOffset.x / card.width

                                const index = clamp(Math.ceil(pos), 0, stops)
                                setCardIndex(index)

                                const position = Animated.divide(
                                    ev.nativeEvent.contentOffset.x,
                                    new Animated.Value(card.width),
                                )
                                setPosition(position)
                            },
                        },
                    )}
                    // this needs to be referential equal or will trigger
                    // a re-render
                    extraData={`${container.width}:${container.height}`}
                    data={cards}
                    renderItem={({
                        item,
                        index,
                    }: {
                        item: FlatCard
                        index: number
                    }) => (
                        <CollectionPageInFront
                            articlesInCard={item.articles || []}
                            appearance={item.appearance}
                            collection={item.collection.key}
                            front={frontData.key}
                            width={card.width}
                            {...{
                                scrollX,
                                localIssueId,
                                publishedIssueId,
                                index,
                                pillar,
                                articleNavigator,
                            }}
                        />
                    )}
                />
            </Wrapper>
        )
    },
)
