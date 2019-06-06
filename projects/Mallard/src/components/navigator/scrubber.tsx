import React from 'react'

import { color } from '../../theme/color'
import { Animated, Text, StyleSheet } from 'react-native'
import { signPostRadius } from './helpers'

const Scrubber = ({
    children,
    fill,
    position,
    scrubbing,
}: {
    fill: string
    children: string
    position: Animated.AnimatedInterpolation
    scrubbing: boolean
}) => {
    const styles = StyleSheet.create({
        bubble: {
            height: signPostRadius * 2,
            minWidth: signPostRadius * 2,
            paddingHorizontal: signPostRadius * 0.55,
            alignItems: 'flex-start',
            alignSelf: 'flex-start',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            flex: 0,
            width: 'auto',
        },
        innerBubble: {
            backgroundColor: fill,
            borderRadius: signPostRadius,
            zIndex: -1,
            ...StyleSheet.absoluteFillObject,
        },
        text: {
            color: color.textOverDarkBackground,
            fontSize: 22,
            height: signPostRadius * 2,
            lineHeight: signPostRadius * 1.75,
            alignItems: 'center',
            fontFamily: 'GTGuardianTitlepiece-Bold',
        },
    })
    return (
        <Animated.View
            style={[styles.bubble, { transform: [{ translateX: position }] }]}
        >
            <Animated.Text
                style={[
                    styles.text,
                    {
                        opacity: position.interpolate({
                            inputRange: [0, 20],
                            outputRange: [1, 0],
                        }),
                        transform: [
                            {
                                translateX: position.interpolate({
                                    inputRange: [0, 20],
                                    outputRange: [0, -10],
                                }),
                            },
                            {
                                scaleX: position.interpolate({
                                    inputRange: [0, 20],
                                    outputRange: [1, 0.5],
                                }),
                            },
                        ],
                    },
                ]}
            >
                {children}
            </Animated.Text>
            <Animated.View
                style={[
                    styles.innerBubble,
                    {
                        opacity: position.interpolate({
                            inputRange: [0, 20],
                            outputRange: [1, 0],
                        }),
                        transform: [
                            {
                                scaleX: position.interpolate({
                                    inputRange: [0, 20],
                                    outputRange: [1, 0.25],
                                }),
                            },
                        ],
                    },
                ]}
            />
            <Animated.View
                style={[
                    styles.innerBubble,
                    {
                        width: signPostRadius * 2,
                        alignItems: 'center',
                        opacity: position.interpolate({
                            inputRange: [0, 5, 20],
                            outputRange: [0, 0.5, 1],
                        }),
                        transform: [
                            {
                                scaleX: position.interpolate({
                                    inputRange: [0, 20],
                                    outputRange: [1.25, 1],
                                    extrapolate: 'clamp',
                                }),
                            },
                            {
                                scale: scrubbing ? 1.2 : 1,
                            },
                        ],
                    },
                ]}
            >
                <Text style={[styles.text]}>{children[0]}</Text>
            </Animated.View>
        </Animated.View>
    )
}

export { Scrubber }
