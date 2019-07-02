import React, { useMemo, useRef } from 'react'

import { color } from 'src/theme/color'
import { Animated, Text, StyleSheet } from 'react-native'

const getStyles = (fill: string, radius: number) =>
    StyleSheet.create({
        root: {
            height: radius * 2,
            minWidth: radius * 2,
            paddingHorizontal: radius * 0.55,
            alignItems: 'flex-start',
            alignSelf: 'flex-start',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            flex: 0,
            width: 'auto',
        },
        bubble: {
            backgroundColor: fill,
            borderRadius: radius,
            zIndex: -1,
            ...StyleSheet.absoluteFillObject,
        },
        text: {
            color: color.textOverDarkBackground,
            fontSize: 22,
            height: radius * 2,
            lineHeight: radius * 1.75,
            alignItems: 'center',
            fontFamily: 'GTGuardianTitlepiece-Bold',
        },
    })

const Scrubber = ({
    fill,
    children,
    position,
    scrubbing,
    radius,
}: {
    fill: string
    children: string
    position: Animated.AnimatedInterpolation
    scrubbing: boolean
    radius: number
}) => {
    const styles = useMemo(() => getStyles(fill, radius), [fill, radius])
    const width = useRef(null)
    return (
        <Animated.View
            style={[
                styles.root,
                {
                    transform: [{ translateX: position }],
                },
            ]}
        >
            <Animated.Text
                style={[
                    styles.text,
                    {
                        opacity: position.interpolate({
                            inputRange: [0, 10],
                            outputRange: [1, 0],
                        }),
                        transform: [
                            {
                                translateX: position.interpolate({
                                    inputRange: [0, 20],
                                    outputRange: [0, -20],
                                }),
                            },
                        ],
                    },
                ]}
            >
                {children}
            </Animated.Text>
            <Animated.View
                onLayout={ev => {
                    width.current = ev.nativeEvent.layout.width
                }}
                style={[
                    styles.bubble,
                    {
                        opacity: position.interpolate({
                            inputRange: [0, 20],
                            outputRange: [1, 0],
                        }),
                        transform: [
                            //{ translateX: width.current || 0 },
                            {
                                translateX: position.interpolate({
                                    inputRange: [0, 20],
                                    outputRange: [
                                        0,
                                        (width.current || 0) * -0.4,
                                    ],
                                }),
                            },
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
                    styles.bubble,
                    {
                        width: radius * 2,
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
