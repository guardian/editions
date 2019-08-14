import React, { useMemo, useRef, useState } from 'react'

import { color } from 'src/theme/color'
import { Animated, Text, StyleSheet, View } from 'react-native'
import { clamp } from 'src/helpers/math'

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
        backgroundFill: {
            backgroundColor: fill,
            ...StyleSheet.absoluteFillObject,
        },
        roundBubble: {
            borderRadius: radius,
            width: radius * 2,
            alignItems: 'center',
        },
        leftBubbleCap: {
            left: radius * -1,
        },
        rightBubbleCap: {
            left: 'auto',
            right: radius * -1,
        },
        text: {
            color: color.textOverDarkBackground,
            fontSize: 22,
            height: radius * 2,
            lineHeight: radius * 1.75,
            alignItems: 'center',
            fontFamily: 'GTGuardianTitlepiece-Bold',
        },
        header: {
            paddingHorizontal: radius * 0.75,
        },
        lozengeContainer: {
            ...StyleSheet.absoluteFillObject,
            left: radius,
            right: radius,
            zIndex: -1,
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
                                inputRange: [0, 100],
                                outputRange: [0, 100],
                                extrapolateLeft: 'clamp',
                            }),
                        },
                    ],
                },
            ]}
        >
            {position && (
                <>
                    <Animated.Text
                        accessibilityRole="header"
                        allowFontScaling={false}
                        style={[
                            styles.text,
                            styles.header,
                            width && {
                                opacity: position.interpolate({
                                    inputRange: [0, 20],
                                    outputRange: [1, 0],
                                    extrapolate: 'clamp',
                                }),
                                transform: [
                                    {
                                        translateX: position.interpolate({
                                            inputRange: [0, width],
                                            outputRange: [0, width * -0.5],
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
                        style={styles.lozengeContainer}
                    >
                        <Animated.View
                            accessible={false}
                            style={[
                                styles.backgroundFill,
                                {
                                    width: '100%',
                                },
                                {
                                    transform: [
                                        {
                                            translateX: position.interpolate({
                                                inputRange: [0, 20],
                                                outputRange: [
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
                        />
                        <Animated.View
                            accessible={false}
                            style={[
                                styles.backgroundFill,
                                styles.roundBubble,
                                styles.rightBubbleCap,
                                width && {
                                    opacity: position.interpolate({
                                        inputRange: [
                                            0,
                                            clamp(
                                                width - radius,
                                                width,
                                                Infinity,
                                            ),
                                            width,
                                        ],
                                        outputRange: [1, 1, 0],
                                        extrapolate: 'clamp',
                                    }),
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
                        />
                        <View
                            accessible={false}
                            style={[
                                styles.backgroundFill,
                                styles.roundBubble,
                                styles.leftBubbleCap,
                            ]}
                        ></View>
                    </Animated.View>
                </>
            )}
            <Animated.View
                accessible={false}
                style={[
                    styles.backgroundFill,
                    styles.roundBubble,
                    {
                        transform: [{ translateX: -1 }],
                    },
                    position && {
                        opacity: position.interpolate({
                            inputRange: [0, 10],
                            outputRange: [0, 1],
                            extrapolate: 'clamp',
                        }),
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
