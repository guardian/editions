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
export const SlideCard = ({
    children,
    headerStyle,
    onDismiss,
}: {
    children: ReactNode

    headerStyle: {}
    onDismiss: () => void
}) => {
    const [scale] = useState(() => new Animated.Value(1))
    const [scrollIndicatorVisible, setScrollIndicatorVisible] = useState(false)
    useEffect(() => {
        scale.addListener(({ value }) => {
            setScrollIndicatorVisible(value > 0)
            if (value < -100) {
                onDismiss()
            }
        })
    }, [])
    const [translateX] = useState(() => new Animated.Value(0))
    const [panResponder] = useState(() =>
        PanResponder.create({
            onMoveShouldSetPanResponder: (e, { dy }) => dy > 10,
            onPanResponderMove: Animated.event([null, { dy: translateX }]),
            onPanResponderRelease: (e, { dy }) => {
                if (Math.abs(dy) >= 100) {
                    onDismiss()
                } else {
                    Animated.spring(translateX, {
                        toValue: 0,
                        bounciness: 10,
                    }).start()
                }
            },
        }),
    )
    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [
                        {
                            translateY: Animated.add(
                                scale.interpolate({
                                    inputRange: [-100, 0],
                                    outputRange: [100, 0],
                                    extrapolate: 'clamp',
                                }),
                                translateX,
                            ),
                        },
                    ],
                },
            ]}
        >
            <View
                style={[
                    headerStyle,
                    {
                        alignItems: 'center',
                        borderTopWidth: StyleSheet.hairlineWidth,
                        borderBottomWidth: scrollIndicatorVisible
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
                                    translateY: scale.interpolate({
                                        inputRange: [50, 250],
                                        outputRange: [metrics.vertical / -4, 0],
                                        extrapolate: 'clamp',
                                        easing: Easing.elastic(1),
                                    }),
                                },
                            ],
                        }}
                    >
                        <Chevron />
                    </Animated.View>
                </TouchableWithoutFeedback>
            </View>

            <Animated.ScrollView
                scrollEventThrottle={1}
                showsVerticalScrollIndicator={scrollIndicatorVisible}
                contentContainerStyle={{ flexGrow: 1 }}
                style={{
                    flexGrow: 1,
                    background: 'blue',
                    transform: [
                        {
                            translateY: scale.interpolate({
                                inputRange: [-100, 0],
                                outputRange: [-100, 0],
                                extrapolate: 'clamp',
                            }),
                        },
                    ],
                }}
                onScroll={Animated.event([
                    {
                        nativeEvent: {
                            contentOffset: {
                                y: scale,
                            },
                        },
                    },
                ])}
            >
                {children}
            </Animated.ScrollView>
        </Animated.View>
    )
}
