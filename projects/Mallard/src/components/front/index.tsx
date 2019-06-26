import React, { useState, useRef, FunctionComponent, ReactNode } from 'react'
import { View, Dimensions, Animated, FlatList, StyleSheet } from 'react-native'
import { useJsonOrEndpoint } from '../../hooks/use-fetch'
import { metrics } from 'src/theme/spacing'
import { CollectionPage } from './collection-page/collection-page'
import { Navigator, NavigatorSkeleton } from '../navigator'
import { ArticleAppearance } from 'src/theme/appearance'
import { Front as FrontType } from '../../../../backend/common'
import { Spinner } from '../spinner'
import { FlexCenter } from '../layout/flex-center'
import { Issue, Collection, Article } from 'src/common'
import { color as themeColor } from '../../theme/color'
import { withResponse } from 'src/hooks/use-response'
import { FlexErrorMessage } from '../layout/errors/flex-error-message'
import { GENERIC_ERROR } from 'src/helpers/words'
import { useSettings } from 'src/hooks/use-settings'
import { FSPaths, APIPaths } from 'src/paths'

interface AnimatedFlatListRef {
    _component: FlatList<FrontType['collections'][0]>
}
interface FlatCardType {
    collection: Collection
    articles: Article[]
}

const useFrontsResponse = (issue: Issue['key'], front: FrontType['key']) => {
    const resp = useJsonOrEndpoint<FrontType>(
        issue,
        FSPaths.front(issue, front),
        APIPaths.front(issue, front),
        {
            validator: res => res.collections != null,
        },
    )
    return withResponse<FrontType>(resp)
}

/*
Map the position of the tap on the screen to
the position of the tap on the scrubber itself (which has padding).
This is coupled to the visual layout and we can be a bit more
clever but also for now this works
*/
const getScrollPos = (screenX: number) => {
    const { width } = Dimensions.get('window')
    return screenX + (metrics.horizontal * 6 * screenX) / width
}

const getNearestPage = (screenX: number, pageCount: number): number => {
    const { width } = Dimensions.get('window')
    return Math.round((getScrollPos(screenX) * (pageCount - 1)) / width)
}

const getTranslateForPage = (scrollX: Animated.Value, page: number) => {
    const { width } = Dimensions.get('window')
    return scrollX.interpolate({
        inputRange: [width * (page - 1), width * page, width * (page + 1)],
        outputRange: [
            metrics.frontsPageSides * -1.75,
            0,
            metrics.frontsPageSides * 1.75,
        ],
    })
}

const Page = ({
    articles,
    issue,
    appearance,
    index,
    collection,
    scrollX,
}: {
    appearance: ArticleAppearance
    index: number
    scrollX: Animated.Value
    articles: Article[]
    collection: Collection['key']
    issue: Issue['key']
}) => {
    const { width } = Dimensions.get('window')
    const translateX = getTranslateForPage(scrollX, index)
    return (
        <View style={{ width }}>
            <CollectionPage
                articles={Object.values(articles)}
                translate={translateX}
                {...{ issue, collection, appearance }}
                style={[
                    {
                        flex: 1,
                        transform: [
                            {
                                translateX,
                            },
                        ],
                    },
                ]}
            />
        </View>
    )
}

const wrapperStyles = StyleSheet.create({
    inner: { height: metrics.frontsPageHeight },
})

const Wrapper: FunctionComponent<{
    scrubber: ReactNode
    children: ReactNode
}> = ({ children, scrubber }) => {
    return (
        <View>
            <View
                style={{
                    padding: metrics.horizontal,
                    marginBottom: 0,
                    marginTop: metrics.vertical * 2,
                }}
            >
                {scrubber}
            </View>
            <View style={wrapperStyles.inner}>{children}</View>
        </View>
    )
}

const FrontWithResponse = ({
    frontData,
    issue,
}: {
    issue: Issue['key']
    frontData: FrontType
}) => {
    const color = themeColor.palette.news.bright
    const [scrollX] = useState(() => new Animated.Value(0))
    const flatListRef = useRef<AnimatedFlatListRef | undefined>()
    const { width } = Dimensions.get('window')
    const cards: FlatCardType[] = frontData.collections
        .map(collection =>
            collection.cards
                .filter(card => Boolean(card.articles))
                .map(({ articles }) => ({
                    articles: Object.values(articles || {}),
                    collection,
                })),
        )
        .reduce((acc, val) => acc.concat(val), [])
    const stops = cards.length
    return (
        <Wrapper
            scrubber={
                <Navigator
                    stops={stops + 1}
                    title={frontData.key}
                    fill={color}
                    onScrub={screenX => {
                        if (
                            flatListRef.current &&
                            flatListRef.current._component
                        ) {
                            flatListRef.current._component.scrollToOffset({
                                offset: getScrollPos(screenX) * stops,
                                animated: false,
                            })
                        }
                    }}
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
                        inputRange: [0, width * stops + 0.001],
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
                keyExtractor={(item: FlatCardType, index: number) =>
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
                    item: FlatCardType
                    index: number
                }) => (
                    <Page
                        appearance={'news'}
                        articles={item.articles || []}
                        collection={item.collection.key}
                        {...{ scrollX, issue, index }}
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
    const [{ isUsingProdDevtools }] = useSettings()
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
                <FlexErrorMessage
                    title={GENERIC_ERROR}
                    message={isUsingProdDevtools ? err.message : undefined}
                />
            </Wrapper>
        ),
        success: frontData => <FrontWithResponse {...{ frontData, issue }} />,
    })
}
