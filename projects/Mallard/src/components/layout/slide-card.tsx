import React, { useState, useEffect, ReactNode, useRef } from 'react'
import { Animated, View, Text, Platform, StyleSheet } from 'react-native'

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
    onDismiss,
}: {
    children: ReactNode
    header: ReactNode
    onDismiss: () => void
}) => {
    const [scale] = useState(() => new Animated.Value(1))
    const [scrollIndicatorVisible, setScrollIndicatorVisible] = useState(true)
    useEffect(() => {
        scale.addListener(({ value }) => {
            setScrollIndicatorVisible(value > 50)
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
            {header}
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
