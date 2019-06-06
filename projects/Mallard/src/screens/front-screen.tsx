import React, { useState, useEffect, useRef, useMemo } from 'react'
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    Dimensions,
    Animated,
} from 'react-native'
import { MonoTextBlock, HeadlineText } from '../components/styled-text'
import { Grid } from '../components/lists/grid'
import { useEndpoint } from '../hooks/use-fetch'
import { NavigationScreenProp } from 'react-navigation'
import { metrics } from '../theme/spacing'
import { container } from '../theme/styles'
import { NavigatorStrip } from '../components/navigator'

const styles = StyleSheet.create({
    container,
    contentContainer: {},
})

const useFrontsData = () => useEndpoint('', [], res => res)

const FrontRow: React.FC<{
    frontsData: any
    front: any
    issue: any
    navigation: any
}> = ({ frontsData, front, issue, navigation }) => {
    const { width } = Dimensions.get('window')
    const [scrollX] = useState(() => new Animated.Value(0))
    const scrollViewRef = useRef()
    const pages = 3
    const getScrollPos = x => {
        const { width } = Dimensions.get('window')
        return (
            (x - metrics.horizontal) *
            ((width - metrics.horizontal * 4) / width) *
            pages
        )
    }
    const getNearestPage = x => {
        const { width } = Dimensions.get('window')
        return Math.round(getScrollPos(x) / width)
    }
    return (
        <>
            <View
                style={{
                    padding: metrics.horizontal,
                    paddingBottom: 0,
                    paddingTop: metrics.vertical * 2,
                }}
            >
                <NavigatorStrip
                    title={front}
                    onScrub={x => {
                        if (
                            scrollViewRef.current &&
                            scrollViewRef.current._component
                        ) {
                            scrollViewRef.current._component.scrollTo({
                                x: getScrollPos(x),
                                animated: false,
                            })
                        }
                    }}
                    onReleaseScrub={x => {
                        scrollViewRef.current._component.scrollTo({
                            x:
                                Dimensions.get('window').width *
                                getNearestPage(x),
                        })
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
                ref={scrollView => (scrollViewRef.current = scrollView)}
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
                        onPress={(item: string) =>
                            navigation.navigate('Article', item)
                        }
                        data={frontsData.map(
                            ([title]: any[], index: number) => ({
                                issue,
                                front,
                                article: index,
                                key: index.toString() + '1',
                                title,
                                headline: title,
                            }),
                        )}
                    />
                </View>
                <View style={{ width }}>
                    <Grid
                        onPress={(item: string) =>
                            navigation.navigate('Article', item)
                        }
                        data={frontsData.map(
                            ([title]: any[], index: number) => ({
                                issue,
                                front,
                                article: index,
                                key: index.toString() + '2',
                                title,
                                headline: title,
                            }),
                        )}
                    />
                </View>
                <View style={{ width }}>
                    <Grid
                        onPress={(item: string) =>
                            navigation.navigate('Article', item)
                        }
                        data={frontsData.map(
                            ([title]: any[], index: number) => ({
                                issue,
                                front,
                                article: index,
                                key: index.toString() + '3',
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
    const issue = navigation.getParam('issue', 'NO-ID')
    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            <FrontRow front={'News'} {...{ issue, navigation, frontsData }} />
            <FrontRow front={'Sport'} {...{ issue, navigation, frontsData }} />
            <FrontRow
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
