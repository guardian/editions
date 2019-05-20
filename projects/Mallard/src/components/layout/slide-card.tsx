import React, { useState, useEffect, ReactNode, useRef } from 'react'
import {
    Animated,
    View,
    Text,
    Platform,
    StyleSheet,
    TouchableHighlight,
    PanResponder,
    TouchableWithoutFeedback,
    Easing,
} from 'react-native'
import { Chevron } from '../chevron'
import { metrics } from '../../theme/spacing'

/* 
This is the swipey contraption that contains an article.

on iOS you can swipe it down to close

TODO: you should be able to swipe it to the left too
*/
const notchInsetSize = Platform.OS === 'ios' ? 50 : 0
const styles = StyleSheet.create({
    container: {
        marginTop: notchInsetSize,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        flex: 1,
    },
})

const dismissAt = 100

const Header = ({
    scrollY,
    isScrolling,
    cardOffset,
    headerStyle,
    onDismiss,
}: any) => {
    const [panResponder] = useState(() =>
        PanResponder.create({
            onMoveShouldSetPanResponder: (e, { dy }) => dy > 10,
            onPanResponderMove: Animated.event([null, { dy: cardOffset }]),
            onPanResponderRelease: (e, { dy }) => {
                if (Math.abs(dy) >= dismissAt) {
                    onDismiss()
                } else {
                    Animated.spring(cardOffset, {
                        toValue: 0,
                        bounciness: 10,
                        useNativeDriver: true,
                    }).start()
                }
            },
        }),
    )
    return (
        <View
            style={[
                headerStyle,
                {
                    alignItems: 'center',
                    borderTopWidth: StyleSheet.hairlineWidth,
                    borderBottomWidth: isScrolling
                        ? StyleSheet.hairlineWidth
                        : 0,
                },
            ]}
            {...panResponder.panHandlers}
        >
            <TouchableWithoutFeedback
                onPress={onDismiss}
                accessibilityHint="Go back"
            >
                <Animated.View
                    style={{
                        padding: metrics.vertical,
                        transform: [
                            {
                                translateY: scrollY.interpolate({
                                    inputRange: [50, 250],
                                    outputRange: [metrics.vertical / -4, 0],
                                    extrapolate: 'clamp',
                                }),
                            },
                        ],
                    }}
                >
                    <Chevron />
                </Animated.View>
            </TouchableWithoutFeedback>
        </View>
    )
}

export const SlideCard = ({
    children,
    headerStyle,
    backgroundColor,
    onDismiss,
}: {
    children: ReactNode
    headerStyle: {}
    backgroundColor: string
    onDismiss: () => void
}) => {
    const [scrollY] = useState(() => new Animated.Value(1))
    const [cardOffset] = useState(() => new Animated.Value(0))
    const [isScrolling, setIsScrolling] = useState(false)
    useEffect(() => {
        scrollY.addListener(({ value }) => {
            setIsScrolling(value > 0)
            if (value < dismissAt * -1) {
                onDismiss()
            }
        })
    }, [])
    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [
                        {
                            translateY: Animated.add(
                                scrollY.interpolate({
                                    inputRange: [dismissAt * -1, 0],
                                    outputRange: [dismissAt, 0],
                                    extrapolate: 'clamp',
                                }),
                                cardOffset,
                            ),
                        },
                    ],
                },
            ]}
        >
            <Header
                {...{
                    scrollY,
                    isScrolling,
                    cardOffset,
                    headerStyle,
                    onDismiss,
                }}
            />
            <Animated.ScrollView
                scrollEventThrottle={1}
                contentContainerStyle={{
                    flexGrow: 1,
                }}
                style={{ backgroundColor }}
                onScroll={Animated.event(
                    [
                        {
                            nativeEvent: {
                                contentOffset: {
                                    y: scrollY,
                                },
                            },
                        },
                    ],
                    { useNativeDriver: true },
                )}
            >
                <Animated.View
                    style={{
                        transform: [
                            {
                                translateY: scrollY.interpolate({
                                    inputRange: [-100, 0],
                                    outputRange: [-100, 0],
                                    extrapolate: 'clamp',
                                }),
                            },
                        ],
                    }}
                >
                    {children}
                </Animated.View>
            </Animated.ScrollView>
        </Animated.View>
    )
}
