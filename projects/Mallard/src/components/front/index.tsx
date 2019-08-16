import React, {
    useState,
    useRef,
    FunctionComponent,
    useMemo,
    useEffect,
} from 'react'
import { Animated, View } from 'react-native'
import { CollectionPage, PropTypes } from './collection-page'
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
import { Wrapper } from './helpers/wrapper'
import {
    getTranslateForPage,
    AnimatedFlatListRef,
    getNearestPage,
    PageLayoutSizes,
} from './helpers/helpers'
import { useFrontsResponse } from 'src/hooks/use-issue'
import { ArticleNavigator } from '../../screens/article-screen'
import { WithArticle, getAppearancePillar } from '../../hooks/use-article'
import { useIssueScreenSize } from 'src/screens/issue/use-size'

const CollectionPageInFront = ({
    index,
    pillar,
    scrollX,
    ...collectionPageProps
}: {
    index: number
    pillar: PillarFromPalette
    scrollX: Animated.Value
} & PropTypes) => {
    const { card, size } = useIssueScreenSize()
    const translate = getTranslateForPage(
        card.width,
        scrollX,
        index,
        size === PageLayoutSizes.mobile ? 1 : 0.5,
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
            <WithArticle type={'article'} pillar={pillar}>
                <CollectionPage
                    translate={translate}
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
    const { card, container } = useIssueScreenSize()

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
                        outputRange: [0, 1],
                    })}
                />
            }
        >
            <Animated.FlatList
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={1}
                horizontal={true}
                removeClippedSubviews={false}
                decelerationRate="fast"
                snapToInterval={card.width}
                ref={(flatList: AnimatedFlatListRef) =>
                    (flatListRef.current = flatList)
                }
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
                extraData={{
                    ...card,
                    cw: container.width,
                    ch: container.height,
                }}
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
