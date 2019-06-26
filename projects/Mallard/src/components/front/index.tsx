import React, { useState, useRef, FunctionComponent, ReactNode } from 'react'
import { View, Dimensions, Animated, FlatList, StyleSheet } from 'react-native'
import { useJsonOrEndpoint } from '../../hooks/use-fetch'
import { metrics } from 'src/theme/spacing'
import { CollectionPage } from './collection-page/collection-page'
import { Navigator, NavigatorSkeleton } from '../navigator'
import { ArticleAppearance } from 'src/theme/appearance'
import {
    Front as FrontType,
    Collection as CollectionType,
} from '../../../../backend/common'
import { Spinner } from '../spinner'
import { FlexCenter } from '../layout/flex-center'
import { Issue } from 'src/common'
import { color as themeColor } from '../../theme/color'
import { withResponse } from 'src/hooks/use-response'
import { FlexErrorMessage } from '../layout/errors/flex-error-message'
import { ERR_404_REMOTE, GENERIC_ERROR } from 'src/helpers/words'
import { superHeroPage, threeStoryPage, fiveStoryPage } from './layouts'
import { useSettings } from 'src/hooks/use-settings'

interface AnimatedFlatListRef {
    _component: FlatList<FrontType['collections'][0]>
}

const useFrontsResponse = (issue: Issue['key'], front: FrontType['key']) => {
    const resp = useJsonOrEndpoint<FrontType>(issue, `front/${front}`, {
        validator: res => res.collections != null,
    })
    return withResponse<FrontType>(resp)
}

const useCollectionResponse = (
    issue: Issue['key'],
    collection: CollectionType['key'],
) =>
    withResponse<CollectionType>(
        useJsonOrEndpoint<CollectionType>(issue, `collection/${collection}`),
    )

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
    collection,
    issue,
    appearance,
    index,
    scrollX,
}: {
    appearance: ArticleAppearance
    index: number
    scrollX: Animated.Value
    collection: CollectionType['key']
    issue: Issue['key']
}) => {
    const { width } = Dimensions.get('window')
    const translateX = getTranslateForPage(scrollX, index)
    const collectionResponse = useCollectionResponse(issue, collection)
    const [{ isUsingProdDevtools }] = useSettings()
    return (
        <View style={{ width }}>
            {collectionResponse({
                error: ({ message }) => (
                    <FlexErrorMessage
                        title={GENERIC_ERROR}
                        message={isUsingProdDevtools ? message : undefined}
                    />
                ),
                pending: () => (
                    <FlexCenter>
                        <Spinner />
                    </FlexCenter>
                ),
                success: collectionData =>
                    collectionData.articles ? (
                        <CollectionPage
                            articles={Object.values(collectionData.articles)}
                            translate={translateX}
                            pageLayout={
                                index === 0
                                    ? superHeroPage
                                    : index === 1
                                    ? threeStoryPage
                                    : undefined
                            }
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
                    ) : (
                        <FlexErrorMessage title={ERR_404_REMOTE} />
                    ),
            })}
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

export const Front: FunctionComponent<{
    front: string
    issue: Issue['key']
    viewIsTransitioning: boolean
}> = ({ front, issue }) => {
    const [scrollX] = useState(() => new Animated.Value(0))
    const flatListRef = useRef<AnimatedFlatListRef | undefined>()
    const frontsResponse = useFrontsResponse(issue, front)
    const [{ isUsingProdDevtools }] = useSettings()
    const { width } = Dimensions.get('window')
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
        success: frontData => {
            const color = themeColor.palette.news.bright
            const pages = frontData.collections.length
            const collections = frontData.collections

            return (
                <Wrapper
                    scrubber={
                        <Navigator
                            stops={pages}
                            title={front}
                            fill={color}
                            onScrub={screenX => {
                                if (
                                    flatListRef.current &&
                                    flatListRef.current._component
                                ) {
                                    flatListRef.current._component.scrollToOffset(
                                        {
                                            offset:
                                                getScrollPos(screenX) *
                                                (pages - 1),
                                            animated: false,
                                        },
                                    )
                                }
                            }}
                            onReleaseScrub={screenX => {
                                if (
                                    flatListRef.current &&
                                    flatListRef.current._component
                                ) {
                                    flatListRef.current._component.scrollToOffset(
                                        {
                                            offset:
                                                getNearestPage(screenX, pages) *
                                                width,
                                        },
                                    )
                                }
                            }}
                            position={scrollX.interpolate({
                                inputRange: [0, width * (pages - 1) + 0.001],
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
                        initialNumToRender={1}
                        windowSize={3}
                        horizontal={true}
                        pagingEnabled
                        data={collections}
                        ref={(flatList: AnimatedFlatListRef) =>
                            (flatListRef.current = flatList)
                        }
                        getItemLayout={(_: never, index: number) => ({
                            length: width,
                            offset: width * index,
                            index,
                        })}
                        keyExtractor={(item: FrontType['collections'][0]) =>
                            item
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
                        renderItem={({
                            item,
                            index,
                        }: {
                            item: FrontType['collections'][0]
                            index: number
                        }) => (
                            <Page
                                appearance={'news'}
                                collection={item}
                                {...{ scrollX, issue, index }}
                            />
                        )}
                    />
                </Wrapper>
            )
        },
    })
}
