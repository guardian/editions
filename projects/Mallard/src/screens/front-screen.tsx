import React, { useState, useRef, FunctionComponent } from 'react'
import {
    ScrollView,
    View,
    StyleSheet,
    Dimensions,
    Animated,
} from 'react-native'
import { MonoTextBlock } from '../components/styled-text'
import { useEndpoint } from '../hooks/use-fetch'
import { NavigationScreenProp } from 'react-navigation'
import { metrics } from '../theme/spacing'
import { container } from '../theme/styles'
import { FrontCardGroup } from '../components/front/front-card-group'
import { FrontsData } from '../helpers/types'
import { Navigator } from '../components/navigator'
import { color } from '../theme/color'
import { ArticleAppearance } from '../theme/appearance'

interface AnimatedScrollViewRef {
    _component: ScrollView
}

const styles = StyleSheet.create({
    container,
    contentContainer: {},
})

const useFrontsData = () => useEndpoint('', [], res => res)

/* 
Map the position of the tap on the screen to 
the position of the tap on the scrubber itself (which has padding). 
This is coupled to the visual layout and we can be a bit more 
clever but also for now this works 
*/
const getScrollPos = (screenX: number) => {
    const { width } = Dimensions.get('window')
    return (
        (screenX - metrics.horizontal) *
        ((width - metrics.horizontal * 6) / width)
    )
}

const getNearestPage = (screenX: number, pageCount: number) => {
    const { width } = Dimensions.get('window')
    return Math.round((getScrollPos(screenX) * pageCount) / width)
}

const getTranslateForPage = (scrollX: Animated.Value, page: number) => {
    const { width } = Dimensions.get('window')
    return scrollX.interpolate({
        inputRange: [width * (page - 1), width * page, width * (page + 1)],
        outputRange: [metrics.horizontal * -1.5, 0, metrics.horizontal * 1.5],
    })
}

const FrontRowPage: FunctionComponent<{
    frontsData: FrontsData
    length: number
    appearance: ArticleAppearance
    page: number
    scrollX: Animated.Value
}> = ({ frontsData, length, appearance, page, scrollX }) => {
    const { width, height: windowHeight } = Dimensions.get('window')
    const height = windowHeight - 300
    //TODO: viewport height - padding - slider

    const translateX = getTranslateForPage(scrollX, page)

    return (
        <View style={{ width }}>
            <FrontCardGroup
                appearance={appearance}
                stories={frontsData}
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

const FrontRow: React.FC<{
    frontsData: FrontsData
    front: any
    issue: any
    navigation: NavigationScreenProp<{}>
    color: string
}> = ({ frontsData, front, issue, navigation, color }) => {
    const { width, height: windowHeight } = Dimensions.get('window')
    const height = windowHeight - 300 //TODO: viewport height - padding - slider
    const [scrollX] = useState(() => new Animated.Value(0))
    const scrollViewRef = useRef<AnimatedScrollViewRef | undefined>()
    const pages = 3

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
                                x: getScrollPos(screenX) * pages,
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
                <FrontRowPage
                    page={0}
                    length={2}
                    appearance={'comment'}
                    {...{ frontsData, scrollX }}
                />
                <FrontRowPage
                    page={1}
                    length={3}
                    appearance={'sport'}
                    {...{ frontsData, scrollX }}
                />
                <FrontRowPage
                    page={2}
                    length={4}
                    appearance={'news'}
                    {...{ frontsData, scrollX }}
                />
            </Animated.ScrollView>
        </>
    )
}

const FrontScreen = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => {
    const frontsData = useFrontsData()
    const issue = navigation.getParam('issue', 'NO-ID')
    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            <FrontRow
                color={color.palette.news.main}
                front={'News'}
                {...{ issue, navigation, frontsData }}
            />
            <FrontRow
                color={color.palette.sport.main}
                front={'Sport'}
                {...{ issue, navigation, frontsData }}
            />
            <FrontRow
                color={color.palette.opinion.main}
                front={'Opinion'}
                {...{ issue, navigation, frontsData }}
            />
            <MonoTextBlock style={{ flex: 1 }}>
                This is a FrontScreen for issue {issue}
            </MonoTextBlock>
        </ScrollView>
    )
}

export { FrontScreen }
