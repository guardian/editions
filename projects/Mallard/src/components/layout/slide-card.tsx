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
import { color } from '../../theme/color'

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
    headerContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        height: metrics.headerHeight,
        zIndex: 90,
        alignContent: 'stretch',
        justifyContent: 'center',
    },
    headerChevronContainer: {
        flex: 1,
        width: '100%',
        paddingHorizontal: metrics.horizontal,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20,
    },
    headerBackground: {
        zIndex: 10,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
})

const dismissAt = 100

const Header = ({ scrollY, cardOffset, style, onDismiss }: any) => {
    const [panResponder] = useState(() =>
        PanResponder.create({
            onStartShouldSetPanResponder: () => false,
            onMoveShouldSetPanResponder: (e, { dy }) => dy > 1,
            onPanResponderMove: Animated.event([null, { dy: cardOffset }]),
            onPanResponderRelease: (e, { dy }) => {
                if (dy >= dismissAt) {
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
        <Animated.View
            style={[styles.headerContainer]}
            {...panResponder.panHandlers}
        >
            <TouchableWithoutFeedback
                onPress={onDismiss}
                accessibilityHint="Go back"
            >
                <Animated.View
                    style={[
                        styles.headerChevronContainer,
                        {
                            transform: [
                                {
                                    translateY: scrollY.interpolate({
                                        inputRange: [0, 200],
                                        outputRange: [
                                            metrics.headerHeight / -4,
                                            0,
                                        ],
                                        extrapolate: 'clamp',
                                    }),
                                },
                            ],
                        },
                    ]}
                >
                    <Chevron color={StyleSheet.flatten(style).color} />
                </Animated.View>
            </TouchableWithoutFeedback>
            <Animated.View
                style={[
                    style,
                    StyleSheet.absoluteFillObject,
                    styles.headerBackground,
                    {
                        opacity: scrollY.interpolate({
                            inputRange: [0, 200],
                            outputRange: [0, 1],
                            extrapolate: 'clamp',
                        }),
                    },
                ]}
            />
        </Animated.View>
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
    backgroundColor: string | undefined
    onDismiss: () => void
}) => {
    const [scrollY] = useState(() => new Animated.Value(1))
    const [cardOffset] = useState(() => new Animated.Value(0))
    useEffect(() => {
        scrollY.addListener(({ value }) => {
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
                style={headerStyle}
                {...{
                    scrollY,
                    cardOffset,
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
