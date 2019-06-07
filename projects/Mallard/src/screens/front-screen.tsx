import React, { useState, useRef } from 'react'
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
                <View style={{ width }}>
                    <FrontCardGroup
                        appearance={'comment'}
                        stories={frontsData}
                        length={2}
                        style={{ height }}
                    />
                </View>
                <View style={{ width }}>
                    <FrontCardGroup
                        appearance={'sport'}
                        stories={frontsData}
                        length={3}
                        style={{ height }}
                    />
                </View>
                <View style={{ width }}>
                    <FrontCardGroup
                        appearance={'news'}
                        stories={frontsData}
                        length={4}
                        style={{ height }}
                    />
                </View>
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
