import React, { useState, useRef, FunctionComponent, useMemo } from 'react'
import { Dimensions, Animated } from 'react-native'
import { CollectionPage, PropTypes } from './collection-page/collection-page'
import { Navigator, NavigatorSkeleton } from '../navigator'
import { Spinner } from '../spinner'
import { FlexCenter } from '../layout/flex-center'
import { Issue, ColorFromPalette, Front as FrontType } from 'src/common'
import { FlexErrorMessage } from '../layout/ui/errors/flex-error-message'
import { GENERIC_ERROR } from 'src/helpers/words'
import { useSettings } from 'src/hooks/use-settings'
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
import { WithArticleAppearance } from 'src/theme/appearance'
import { useFrontsResponse } from 'src/hooks/use-issue'
import { ArticleNavigator } from '../../screens/article-screen'

const CollectionPageInFront = ({
    index,
    appearance,
    scrollX,
    ...collectionPageProps
}: {
    index: number
    appearance: ColorFromPalette
    scrollX: Animated.Value
} & PropTypes) => {
    const { width } = Dimensions.get('window')
    const translate = getTranslateForPage(scrollX, index)
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
            <WithArticleAppearance value={appearance}>
                <CollectionPage
                    translate={translate}
                    {...collectionPageProps}
                />
            </WithArticleAppearance>
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
    const color = getColor(frontData)
    const appearance =
        frontData.color === 'custom' ? 'neutral' : frontData.color

    const [scrollX] = useState(() => new Animated.Value(0))
    const flatListRef = useRef<AnimatedFlatListRef | undefined>()
    const { width } = Dimensions.get('window')
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
            }
            return [flatCollections, navigator]
        },
        frontData.collections.map(({ key }) => key), // eslint-disable-line react-hooks/exhaustive-deps
    )
    const stops = cards.length
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
                            flatListRef.current._component.scrollToOffset({
                                offset: getNearestPage(screenX, stops) * width,
                            })
                        }
                    }}
                    position={scrollX.interpolate({
                        inputRange: [
                            0,
                            width * (stops <= 0 ? stops : stops - 1) + 0.001,
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
                maxToRenderPerBatch={1}
                windowSize={3}
                initialNumToRender={1}
                horizontal={true}
                pagingEnabled
                ref={(flatList: AnimatedFlatListRef) =>
                    (flatListRef.current = flatList)
                }
                getItemLayout={(_: never, index: number) => ({
                    length: width,
                    offset: width * index,
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
                        collection={item.collection.key}
                        front={frontData.key}
                        {...{
                            scrollX,
                            issue,
                            index,
                            appearance,
                            articleNavigator,
                        }}
                    />
                )}
            />
        </Wrapper>
    )
}

export const Front: FunctionComponent<{
    front: string
    issue: Issue['key']
    viewIsTransitioning: boolean
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
