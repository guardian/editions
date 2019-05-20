import React, { useState, useEffect, ReactNode, useRef } from 'react'
import {
    Animated,
    View,
    Text,
    Platform,
    StyleSheet,
    TouchableHighlight,
} from 'react-native'
import { Chevron } from '../chevron'
import { metrics } from '../../theme/spacing'

/* 
This is the swipey contraption that contains an article.

on iOS you can swipe it down to close

TODO: you should be able to swipe it to the left too
TODO: fade in some header view after scrolling past x point
*/
const notchInsetSize = Platform.OS === 'ios' ? 50 : 0
const styles = StyleSheet.create({
    container: {
        marginTop: notchInsetSize,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: 'hidden',
        flex: 1,
    },
})
export const SlideCard = ({
    children,
    header,
    headerStyle,
    onDismiss,
}: {
    children: ReactNode
    header: ReactNode
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
    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [
                        {
                            scale: scale.interpolate({
                                inputRange: [-100, 0],
                                outputRange: [0.9, 1],
                                extrapolate: 'clamp',
                            }),
                        },
                    ],
                },
            ]}
        >
            <TouchableHighlight onPress={onDismiss} accessibilityHint="Go back">
                <View
                    style={[
                        headerStyle,
                        {
                            alignItems: 'center',
                            paddingVertical: metrics.vertical,
                            borderBottomWidth: scrollIndicatorVisible
                                ? StyleSheet.hairlineWidth
                                : 0,
                        },
                    ]}
                >
                    <Animated.View
                        style={{
                            transform: [
                                {
                                    translateY: scale.interpolate({
                                        inputRange: [0, 100],
                                        outputRange: [metrics.vertical / -4, 0],
                                        extrapolate: 'clamp',
                                    }),
                                },
                            ],
                        }}
                    >
                        <Chevron />
                    </Animated.View>
                </View>
            </TouchableHighlight>
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
                onScroll={Animated.event(
                    [
                        {
                            nativeEvent: {
                                contentOffset: {
                                    y: scale,
                                },
                            },
                        },
                    ],
                    { useNativeDriver: true },
                )}
            >
                {children}
            </Animated.ScrollView>
        </Animated.View>
    )
}
