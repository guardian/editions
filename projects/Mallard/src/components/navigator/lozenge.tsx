import React, { useMemo, useRef, useState } from 'react'

import { color } from 'src/theme/color'
import { Animated, Text, StyleSheet, View } from 'react-native'

const getStyles = (fill: string, radius: number) =>
    StyleSheet.create({
        root: {
            height: radius * 2,
            minWidth: radius * 2,
            paddingHorizontal: 0,
            alignItems: 'flex-start',
            alignSelf: 'flex-start',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            flex: 0,
            width: 'auto',
        },
        bubble: {
            backgroundColor: fill,
            zIndex: -1,
            ...StyleSheet.absoluteFillObject,
        },
        roundBubble: {
            borderRadius: radius,
            width: radius * 2,
            alignItems: 'center',
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

const Lozenge = ({
    fill,
    children,
    position,
    scrubbing,
    radius,
}: {
    fill: string
    children: string
    position?: Animated.AnimatedInterpolation
    scrubbing: boolean
    radius: number
}) => {
    const styles = useMemo(() => getStyles(fill, radius), [fill, radius])
    const [width, setWidth] = useState(0)
    return (
        <Animated.View
            style={[
                styles.root,
                position && {
                    transform: [
                        {
                            translateX: position.interpolate({
                                inputRange: [-100, 0, 100],
                                outputRange: [-20, 0, 100],
                            }),
                        },
                    ],
                },
            ]}
        >
            <Animated.Text
                accessibilityRole="header"
                allowFontScaling={false}
                style={[
                    styles.text,
                    {
                        paddingLeft: radius / 2,
                    },
                    position &&
                        width && {
                            opacity: position.interpolate({
                                inputRange: [-100, 0, 10],
                                outputRange: [0.9, 1, 0],
                            }),
                            transform: [
                                {
                                    translateX: position.interpolate({
                                        inputRange: [0, width],
                                        outputRange: [0, width / 2],
                                        extrapolate: 'clamp',
                                    }),
                                },
                            ],
                        },
                ]}
            >
                {children}
            </Animated.Text>
            <Animated.View
                onLayout={(ev: any) => {
                    setWidth(ev.nativeEvent.layout.width)
                }}
                style={[
                    StyleSheet.absoluteFillObject,
                    { zIndex: -1, transform: [{ translateX: radius }] },
                ]}
            >
                <Animated.View
                    accessible={false}
                    style={[
                        styles.bubble,
                        {
                            width: '100%',
                        },
                        position && {
                            transform: [
                                {
                                    translateX: position.interpolate({
                                        inputRange: [-100, 0, 20],
                                        outputRange: [
                                            100,
                                            0,
                                            -20 - width / 2 + radius,
                                        ],
                                        extrapolate: 'clamp',
                                    }),
                                },
                                {
                                    scaleX: position.interpolate({
                                        inputRange: [0, 20],
                                        outputRange: [1, 0],
                                        extrapolate: 'clamp',
                                    }),
                                },
                            ],
                        },
                    ]}
                ></Animated.View>
                <Animated.View
                    accessible={false}
                    style={[
                        styles.bubble,
                        styles.roundBubble,
                        {
                            left: 'auto',
                            right: radius * -1,
                        },

                        position && {
                            transform: [
                                {
                                    translateX: position.interpolate({
                                        inputRange: [0, 20],
                                        outputRange: [
                                            0,
                                            -20 - (width - radius),
                                        ],
                                        extrapolate: 'clamp',
                                    }),
                                },
                            ],
                        },
                    ]}
                ></Animated.View>
                <View
                    accessible={false}
                    style={[
                        styles.bubble,
                        styles.roundBubble,
                        {
                            left: radius * -1,
                        },
                    ]}
                ></View>
            </Animated.View>
            <Animated.View
                accessible={false}
                style={[
                    styles.bubble,
                    styles.roundBubble,
                    position
                        ? {}
                        : {
                              opacity: 0,
                          },
                ]}
            >
                <Text allowFontScaling={false} style={[styles.text]}>
                    {children[0]}
                </Text>
            </Animated.View>
        </Animated.View>
    )
}

export { Lozenge }
