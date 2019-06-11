import React, { useState, useRef, FunctionComponent } from 'react'
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    Dimensions,
    Animated,
} from 'react-native'
import { MonoTextBlock } from '../styled-text'
import { useEndpoint } from '../../hooks/use-fetch'
import { NavigationScreenProp } from 'react-navigation'
import { metrics } from '../../theme/spacing'
import { container } from '../../theme/styles'
import { FrontCardGroup } from './front-card-group'
import { FrontsData } from '../../helpers/types'
import { Navigator } from '../navigator'
import { color } from '../../theme/color'
import { ArticleAppearance } from '../../theme/appearance'
import { Front, Collection } from '../../../../backend/common'

interface AnimatedScrollViewRef {
    _component: ScrollView
}

const styles = StyleSheet.create({
    container,
    contentContainer: {},
})

const useFrontsData = (front: string) =>
    useEndpoint<Front | null>(`front/${front}`, null, res => res)

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

const FrontRowPage: FunctionComponent<{
    length: number
    appearance: ArticleAppearance
    page: number
    scrollX: Animated.Value
    collection: Collection
}> = ({ collection, length, appearance, page, scrollX }) => {
    const { width, height: windowHeight } = Dimensions.get('window')
    const height = windowHeight - 300
    //TODO: viewport height - padding - slider

    const translateX = getTranslateForPage(scrollX, page)

    return (
        <View style={{ width }}>
            <FrontCardGroup
                appearance={appearance}
                collection={collection}
                length={length}
                translate={translateX}
                style={[
                    {
                        height,
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

export const FrontRow: React.FC<{
    front: string
    navigation: NavigationScreenProp<{}>
}> = ({ front, navigation }) => {
    const { width, height: windowHeight } = Dimensions.get('window')
    const height = windowHeight - 300 //TODO: viewport height - padding - slider
    const [scrollX] = useState(() => new Animated.Value(0))
    const scrollViewRef = useRef<AnimatedScrollViewRef | undefined>()

    const frontData = useFrontsData(front)
    if (!frontData) return <Text>LOL</Text>

    const color = 'green'
    const pages = Object.keys(frontData.collections).length
    const collections = Object.entries(frontData.collections)

    return (
        <>
            <View
                style={{
                    padding: metrics.horizontal,
                    paddingBottom: 0,
                    paddingTop: metrics.vertical * 2,
                }}
            >
                <Navigator
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
                            Dimensions.get('window').width * (pages - 1),
                        ],
                        outputRange: [0, 1],
                    })}
                />
            </View>
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
                    <FrontRowPage
                        page={i}
                        length={6}
                        appearance={'comment'}
                        key={id}
                        {...{ collection, scrollX }}
                    />
                ))}
            </Animated.ScrollView>
        </>
    )
}
