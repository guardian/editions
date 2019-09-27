import React, { useState, useRef, FunctionComponent, useMemo } from 'react'
import { Animated, View } from 'react-native'
import { CollectionPage, PropTypes } from './collection-page'
import { Slider, SliderSkeleton } from '../slider'
import { Spinner } from '../spinner'
import { FlexCenter } from '../layout/flex-center'
import {
    Issue,
    ArticlePillar,
    Front as FrontType,
    ArticleType,
} from 'src/common'
import { FlexErrorMessage } from '../layout/ui/errors/flex-error-message'
import {
    FlatCard,
    getColor,
    flattenFlatCardsToFront,
    flattenCollectionsToCards,
} from 'src/helpers/transform'
import { Wrapper } from './helpers/wrapper'
import {
    getTranslateForPage,
    AnimatedFlatListRef,
    getNearestPage,
    PageLayoutSizes,
} from './helpers/helpers'
import { useFrontsResponse } from 'src/hooks/use-issue'
import { ArticleNavigator } from '../../screens/article-screen'
import {
    WithArticle,
    getAppearancePillar,
    getCollectionPillarOverride,
} from '../../hooks/use-article'
import { useIssueScreenSize } from 'src/screens/issue/use-size'
import { safeInterpolation } from 'src/helpers/math'

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

const FrontWithResponse = React.memo(
    ({
        frontData,
        localIssueId,
        publishedIssueId,
    }: {
        localIssueId: Issue['localId']
        publishedIssueId: Issue['publishedId']
        frontData: FrontType
    }) => {
        const color = getColor(frontData.appearance)
        const pillar = getAppearancePillar(frontData.appearance)

        const [scrollX] = useState(() => new Animated.Value(0))
        const flatListRef = useRef<AnimatedFlatListRef | undefined>()
        const [cards, articleNavigator]: [
            FlatCard[],
            ArticleNavigator,
        ] = useMemo(() => {
            const flatCollections = flattenCollectionsToCards(
                frontData.collections,
            )
            const navigator = {
                articles: flattenFlatCardsToFront(flatCollections).map(
                    ({ article, collection }) => ({
                        collection: collection.key,
                        front: frontData.key,
                        article: article.key,
                        localIssueId,
                        publishedIssueId,
                    }),
                ),
                appearance: frontData.appearance,
                frontName: frontData.displayName || '',
            }
            return [flatCollections, navigator]
        }, [localIssueId, publishedIssueId, frontData])

        const stops = cards.length
        const { card, container } = useIssueScreenSize()

        return (
            <Wrapper
                scrubber={
                    <Slider
                        stops={stops}
                        title={frontData.displayName || 'News'}
                        fill={color}
                        onReleaseScrub={screenX => {
                            if (
                                flatListRef.current &&
                                flatListRef.current._component
                            ) {
                                flatListRef.current._component.scrollToOffset({
                                    offset:
                                        getNearestPage(
                                            container.width,
                                            screenX,
                                            stops,
                                        ) * container.width,
                                })
                            }
                        }}
                        position={scrollX.interpolate({
                            inputRange: [
                                0,
                                card.width * (stops <= 0 ? stops : stops - 1) +
                                    0.001,
                            ],
                            outputRange: safeInterpolation([0, 1]),
                        })}
                    />
                }
            >
                <Animated.FlatList
                    showsHorizontalScrollIndicator={false}
                    // These three props are responsible for the majority of
                    // performance improvements
                    initialNumToRender={2}
                    windowSize={5}
                    maxToRenderPerBatch={2}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={1}
                    horizontal={true}
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
                                    contentOffset: {
                                        x: scrollX,
                                    },
                                },
                            },
                        ],
                        { useNativeDriver: true },
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

export const Front: FunctionComponent<{
    front: string
    localIssueId: Issue['localId']
    publishedIssueId: Issue['publishedId']
}> = ({ front, localIssueId, publishedIssueId }) => {
    const frontsResponse = useFrontsResponse(
        localIssueId,
        publishedIssueId,
        front,
    )

    return frontsResponse({
        pending: () => (
            <Wrapper scrubber={<SliderSkeleton />}>
                <FlexCenter>
                    <Spinner />
                </FlexCenter>
            </Wrapper>
        ),
        error: err => (
            <Wrapper scrubber={<SliderSkeleton />}>
                <FlexErrorMessage debugMessage={err.message} />
            </Wrapper>
        ),
        success: frontData => (
            <FrontWithResponse
                {...{ frontData, localIssueId, publishedIssueId }}
            />
        ),
    })
}
