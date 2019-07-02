import React, { useState, useRef, FunctionComponent, useMemo } from 'react'
import { Dimensions, Animated } from 'react-native'

import { CollectionPage, PropTypes } from './collection-page/collection-page'
import { Navigator, NavigatorSkeleton } from '../navigator'
import { Front as FrontType } from '../../../../backend/common'
import { Spinner } from '../spinner'
import { FlexCenter } from '../layout/flex-center'
import { Issue, ColorFromPalette } from 'src/common'
import { withResponse } from 'src/hooks/use-response'
import { FlexErrorMessage } from '../layout/ui/errors/flex-error-message'
import { GENERIC_ERROR } from 'src/helpers/words'
import { useSettings } from 'src/hooks/use-settings'
import { FSPaths, APIPaths } from 'src/paths'
import { FlatCard, flattenCollections, getColor } from 'src/helpers/transform'
import { Wrapper } from './wrapper'
import {
    getTranslateForPage,
    AnimatedFlatListRef,
    getNearestPage,
} from './helpers'
import { WithArticleAppearance } from 'src/theme/appearance'
import { useIssue } from 'src/hooks/use-issue'

const useFrontsResponse = (issue: Issue['key'], front: FrontType['key']) => {
    const resp = useIssue<FrontType>(
        issue,
        FSPaths.front(issue, front),
        APIPaths.front(issue, front),
        {
            validator: res => res.collections != null,
        },
    )
    return withResponse<FrontType>(resp)
}

const WrappedCollectionPage = ({
    index,
    appearance,
    scrollX,
    ...collectionPageProps
}: {
    index: number
    appearance: ColorFromPalette
    scrollX: Animated.Value
} & Exclude<PropTypes, 'translate'>) => {
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
    const cards: FlatCard[] = useMemo(
        () => flattenCollections(frontData.collections),
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
                    <WrappedCollectionPage
                        articles={item.articles || []}
                        collection={item.collection.key}
                        front={frontData.key}
                        {...{ scrollX, issue, index, appearance }}
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
