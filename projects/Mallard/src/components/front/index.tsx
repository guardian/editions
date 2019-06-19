import React, { useState, useRef, FunctionComponent, ReactNode } from 'react'
import { ScrollView, View, Dimensions, Animated } from 'react-native'
import { useEndpointResponse } from '../../hooks/use-fetch'
import { metrics } from '../../theme/spacing'
import { Collection } from './collection'
import { Navigator, NavigatorSkeleton } from '../navigator'
import { ArticleAppearance } from '../../theme/appearance'
import {
    Front as FrontType,
    Collection as CollectionType,
} from '../../../../backend/common'
import { Spinner } from '../spinner'
import { FlexCenter } from '../layout/flex-center'
import { FlexErrorMessage } from '../layout/errors/flex-error-message'

interface AnimatedScrollViewRef {
    _component: ScrollView
}

const useFrontsResponse = (front: string) =>
    useEndpointResponse<FrontType>(
        `front/${front}`,
        res => res.collections != null,
    )

const useCollectionResponse = (collection: string) =>
    useEndpointResponse<CollectionType>(`collection/${collection}`)

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
    appearance,
    index,
    scrollX,
}: {
    appearance: ArticleAppearance
    index: number
    scrollX: Animated.Value
    collection: CollectionType['key']
}) => {
    const { width } = Dimensions.get('window')
    const translateX = getTranslateForPage(scrollX, index)
    const collectionResponse = useCollectionResponse(collection)

    const PageError = useMemo(
        () => ({ message }: { message: string }) => (
            <View style={{ width }}>
                <FlexCenter>
                    <UiBodyCopy weight="bold">
                        Oh no! something failed
                    </UiBodyCopy>
                    <UiExplainerCopy>{message}</UiExplainerCopy>
                </FlexCenter>
            </View>
        ),
        [width],
    )

    return collectionResponse({
        error: ({ message }) => <PageError {...{ message }} />,
        pending: () => <Spinner />,
        success: collection =>
            collection.articles ? (
                <View style={{ width }}>
                    <Collection
                        appearance={appearance}
                        articles={Object.values(collection.articles)}
                        translate={translateX}
                        collection={collection.key}
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
            ) : (
                <PageError message="Empty collection" />
            ),
    })
}

const Wrapper: FunctionComponent<{
    scrubber: ReactNode
    children: ReactNode
}> = ({ children, scrubber }) => {
    const height = Dimensions.get('window').height - 300
    return (
        <View
            style={{
                height,
                maxHeight: height,
                minHeight: height,
            }}
        >
            <View
                style={{
                    padding: metrics.horizontal,
                    marginBottom: 0,
                    marginTop: metrics.vertical * 2,
                }}
            >
                {scrubber}
            </View>
            {children}
        </View>
    )
}

export const Front: FunctionComponent<{
    front: string
    viewIsTransitioning: boolean
}> = ({ front, viewIsTransitioning }) => {
    const [scrollX] = useState(() => new Animated.Value(0))
    const scrollViewRef = useRef<AnimatedScrollViewRef | undefined>()
    const frontsResponse = useFrontsResponse(front)

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
            const color = 'green'
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
                                        (pages - 1),
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
                                index={i}
                                appearance={'sport'}
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
