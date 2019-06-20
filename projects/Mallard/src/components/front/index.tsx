import React, { useState, useRef, FunctionComponent, ReactNode } from 'react'
import {
    ScrollView,
    View,
    Dimensions,
    Animated,
    StyleSheet,
} from 'react-native'
import { useJsonOrEndpoint } from '../../hooks/use-fetch'
import { metrics } from 'src/theme/spacing'
import { Collection } from './collection'
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

interface AnimatedScrollViewRef {
    _component: ScrollView
}

const useFrontsResponse = (issue: Issue['key'], front: FrontType['key']) => {
    const resp = useJsonOrEndpoint<FrontType>(issue, `front/${front}`, {
        validator: res => res.collections != null,
    })
    return withResponse<FrontType>(resp)
}

const useCollectionResponse = (
    issue: Issue['key'],
    collection: Collection['key'],
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

const getNearestPage = (screenX: number, pageCount: number) => {
    const { width } = Dimensions.get('window')
    return Math.round((getScrollPos(screenX) * (pageCount - 1)) / width)
}

const getTranslateForPage = (scrollX: Animated.Value, page: number) => {
    const { width } = Dimensions.get('window')
    return scrollX.interpolate({
        inputRange: [width * (page - 1), width * page, width * (page + 1)],
        outputRange: [metrics.horizontal * -1.5, 0, metrics.horizontal * 1.5],
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

    return (
        <View style={{ width }}>
            {collectionResponse({
                error: ({ message }) => (
                    <FlexErrorMessage title={GENERIC_ERROR} message={message} />
                ),
                pending: () => (
                    <FlexCenter>
                        <Spinner />
                    </FlexCenter>
                ),
                success: collectionData =>
                    collectionData.articles ? (
                        <Collection
                            articles={Object.values(collectionData.articles)}
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
                    ) : (
                        <FlexErrorMessage title={ERR_404_REMOTE} />
                    ),
            })}
        </View>
    )
}

const wrapperStyles = StyleSheet.create({
    inner: { height: metrics.frontCardHeight },
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
}> = ({ front, issue, viewIsTransitioning }) => {
    const [scrollX] = useState(() => new Animated.Value(0))
    const scrollViewRef = useRef<AnimatedScrollViewRef | undefined>()
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
                <FlexErrorMessage
                    title={'Oh no! something failed'}
                    message={err.message}
                />
            </Wrapper>
        ),
        success: frontData => {
            const color = themeColor.palette.news.bright
            const pages = Object.keys(frontData.collections).length
            const collections = viewIsTransitioning
                ? Object.entries(frontData.collections).slice(0, 1)
                : Object.entries(frontData.collections)

            return (
                <Wrapper
                    scrubber={
                        <Navigator
                            stops={pages}
                            title={front}
                            fill={color}
                            onScrub={screenX => {
                                if (
                                    scrollViewRef.current &&
                                    scrollViewRef.current._component
                                ) {
                                    scrollViewRef.current._component.scrollTo({
                                        x: getScrollPos(screenX) * (pages - 1),
                                        animated: false,
                                    })
                                }
                            }}
                            onReleaseScrub={screenX => {
                                if (
                                    scrollViewRef.current &&
                                    scrollViewRef.current._component
                                ) {
                                    scrollViewRef.current._component.scrollTo({
                                        x:
                                            Dimensions.get('window').width *
                                            getNearestPage(screenX, pages),
                                    })
                                }
                            }}
                            position={scrollX.interpolate({
                                inputRange: [
                                    0,
                                    Dimensions.get('window').width *
                                        (pages - 1) +
                                        0.001,
                                ],
                                outputRange: [0, 1],
                            })}
                        />
                    }
                >
                    <Animated.ScrollView
                        ref={(scrollView: AnimatedScrollViewRef) =>
                            (scrollViewRef.current = scrollView)
                        }
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        scrollEventThrottle={1}
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
                        horizontal={true}
                        pagingEnabled
                    >
                        {collections.map(([id, collection], i) => (
                            <Page
                                issue={issue}
                                index={i}
                                appearance={'news'}
                                key={id}
                                {...{ collection, scrollX }}
                            />
                        ))}
                    </Animated.ScrollView>
                </Wrapper>
            )
        },
    })
}
