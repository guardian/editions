import React, { useState, useRef, FunctionComponent, useMemo } from 'react'
import { Dimensions, Animated } from 'react-native'
import { CollectionPage, PropTypes } from './collection-page/collection-page'
import { Navigator, NavigatorSkeleton } from '../navigator'
import { Spinner } from '../spinner'
import { FlexCenter } from '../layout/flex-center'
import { Issue, PillarFromPalette, Front as FrontType } from 'src/common'
import { FlexErrorMessage } from '../layout/ui/errors/flex-error-message'
import {
    FlatCard,
    getColor,
    flattenFlatCardsToFront,
    flattenCollectionsToCards,
} from 'src/helpers/transform'
import { Wrapper } from './wrapper'
import {
    getTranslateForPage,
    AnimatedFlatListRef,
    getNearestPage,
} from './helpers'
import { useFrontsResponse } from 'src/hooks/use-issue'
import { ArticleNavigator } from '../../screens/article-screen'
import { WithArticle, getAppearancePillar } from '../../hooks/use-article'
import { WithBreakpoints } from 'src/components/layout/ui/with-breakpoints'
import { metrics } from 'src/theme/spacing'

const CollectionPageInFront = ({
    index,
    pillar,
    scrollX,
    width,
    ...collectionPageProps
}: {
    index: number
    pillar: PillarFromPalette
    scrollX: Animated.Value
} & PropTypes) => {
    const translate = getTranslateForPage(width, scrollX, index)
    return (
        <Animated.View
            style={[
                {
                    width,
                    transform: [
                        {
                            translateX: translate,
                        },
                    ],
                },
            ]}
        >
            <WithArticle type={'article'} pillar={pillar}>
                <CollectionPage
                    translate={translate}
                    width={width}
                    {...collectionPageProps}
                />
            </WithArticle>
        </Animated.View>
    )
}

const FrontWithResponse = ({
    frontData,
    issue,
}: {
    issue: Issue['key']
    frontData: FrontType
}) => {
    const color = getColor(frontData.appearance)
    const pillar = getAppearancePillar(frontData.appearance)

    const [scrollX] = useState(() => new Animated.Value(0))
    const flatListRef = useRef<AnimatedFlatListRef | undefined>()
    const [cards, articleNavigator]: [FlatCard[], ArticleNavigator] = useMemo(
        () => {
            const flatCollections = flattenCollectionsToCards(
                frontData.collections,
            )
            const navigator = {
                articles: flattenFlatCardsToFront(flatCollections).map(
                    ({ article, collection }) => ({
                        collection: collection.key,
                        front: frontData.key,
                        article: article.key,
                        issue,
                    }),
                ),
                appearance: frontData.appearance,
                frontName: frontData.displayName || '',
            }
            return [flatCollections, navigator]
        },
        frontData.collections.map(({ key }) => key), // eslint-disable-line react-hooks/exhaustive-deps
    )
    const stops = cards.length

    return (
        <WithBreakpoints>
            {{
                0: ({ width }) => {
                    const maxWidth =
                        width > metrics.fronts.cardMaxWidth
                            ? metrics.fronts.cardMaxWidth
                            : width
                    return (
                        <Wrapper
                            scrubber={
                                <Navigator
                                    stops={stops}
                                    title={frontData.displayName || 'News'}
                                    fill={color}
                                    onReleaseScrub={screenX => {
                                        if (
                                            flatListRef.current &&
                                            flatListRef.current._component
                                        ) {
                                            flatListRef.current._component.scrollToOffset(
                                                {
                                                    offset:
                                                        getNearestPage(
                                                            width,
                                                            screenX,
                                                            stops,
                                                        ) * width,
                                                },
                                            )
                                        }
                                    }}
                                    position={scrollX.interpolate({
                                        inputRange: [
                                            0,
                                            width *
                                                (stops <= 0
                                                    ? stops
                                                    : stops - 1) +
                                                0.001,
                                        ],
                                        outputRange: [0, 1],
                                    })}
                                />
                            }
                        >
                            <Animated.FlatList
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                scrollEventThrottle={1}
                                maxToRenderPerBatch={2}
                                windowSize={4}
                                initialNumToRender={2}
                                horizontal={true}
                                decelerationRate="fast"
                                snapToInterval={maxWidth}
                                ref={(flatList: AnimatedFlatListRef) =>
                                    (flatListRef.current = flatList)
                                }
                                getItemLayout={(_: never, index: number) => ({
                                    length: maxWidth,
                                    offset: maxWidth * index,
                                    index,
                                })}
                                keyExtractor={(item: FlatCard, index: number) =>
                                    index + item.collection.key
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
                                extraData={{ width }}
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
                                        width={maxWidth}
                                        {...{
                                            scrollX,
                                            issue,
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
            }}
        </WithBreakpoints>
    )
}

export const Front: FunctionComponent<{
    front: string
    issue: Issue['key']
}> = ({ front, issue }) => {
    const frontsResponse = useFrontsResponse(issue, front)

    return frontsResponse({
        pending: () => (
            <Wrapper scrubber={<NavigatorSkeleton />}>
                <FlexCenter>
                    <Spinner />
                </FlexCenter>
            </Wrapper>
        ),
        error: err => (
            <Wrapper scrubber={<NavigatorSkeleton />}>
                <FlexErrorMessage debugMessage={err.message} />
            </Wrapper>
        ),
        success: frontData => <FrontWithResponse {...{ frontData, issue }} />,
    })
}
