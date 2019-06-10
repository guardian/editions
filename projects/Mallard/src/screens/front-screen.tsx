import React, { useState, useRef, useMemo } from 'react'
import {
    ScrollView,
    View,
    StyleSheet,
    Dimensions,
    Animated,
} from 'react-native'
import { MonoTextBlock } from '../components/styled-text'
import { Grid } from '../components/lists/grid'
import { useEndpoint } from '../hooks/use-fetch'
import { NavigationScreenProp } from 'react-navigation'
import { metrics } from '../theme/spacing'
import { container } from '../theme/styles'
import { Navigator } from '../components/navigator'
import { color } from '../theme/color'
import { Issue } from '../common'
import { renderIssueDate } from '../helpers/issues'

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
    frontsData: any
    front: any
    issue: any
    navigation: NavigationScreenProp<{}>
    color: string
}> = ({ frontsData, front, issue, navigation, color }) => {
    const { width } = Dimensions.get('window')
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
                    <Grid
                        onPress={(item: {}) =>
                            navigation.navigate('Article', item)
                        }
                        data={frontsData.map(
                            ([title]: any[], index: number) => ({
                                issue,
                                front,
                                article: index,
                                key: index.toString() + front + '1',
                                title,
                                headline: title,
                            }),
                        )}
                    />
                </View>
                <View style={{ width }}>
                    <Grid
                        onPress={(item: {}) =>
                            navigation.navigate('Article', item)
                        }
                        data={frontsData.map(
                            ([title]: any[], index: number) => ({
                                issue,
                                front,
                                article: index,
                                key: index.toString() + front + '2',
                                title,
                                headline: title,
                            }),
                        )}
                    />
                </View>
                <View style={{ width }}>
                    <Grid
                        onPress={(item: {}) =>
                            navigation.navigate('Article', item)
                        }
                        data={frontsData.map(
                            ([title]: any[], index: number) => ({
                                issue,
                                front,
                                article: index,
                                key: index.toString() + front + '3',
                                title,
                                headline: title,
                            }),
                        )}
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
    const issue: Issue = navigation.getParam('issue', { date: -1 })
    const issueDate = useMemo(() => renderIssueDate(issue.date), [issue.date])

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            <MonoTextBlock style={{ flex: 1 }}>
                {issueDate.weekday} - {issueDate.date}
            </MonoTextBlock>
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
        </ScrollView>
    )
}

export { FrontScreen }
