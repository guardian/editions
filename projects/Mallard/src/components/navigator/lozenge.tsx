import React, { useMemo, useState } from 'react'

import { color } from 'src/theme/color'
import { Animated, Text, StyleSheet, View } from 'react-native'
import { clamp } from 'src/helpers/math'
import { ariaHidden } from 'src/helpers/a11y'

const fadeLozengeAt = 20

const getStyles = (fill: string, radius: number) => {
    const fillStyle = {
        backgroundColor: fill,
        ...StyleSheet.absoluteFillObject,
    }

    const bubbleStyle = {
        ...fillStyle,
        borderRadius: radius,
        width: radius * 2,
        zIndex: -2,
    }

    return StyleSheet.create({
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
        initialBubble: {
            ...bubbleStyle,
            transform: [{ translateX: -1 }],
            backgroundColor: 'transparent',
            alignItems: 'center',
        },
        leftBubbleCap: {
            ...bubbleStyle,
            left: radius * -1,
        },
        rightBubbleCap: {
            ...bubbleStyle,
            left: 'auto',
            right: radius * -1,
        },
        square: {
            ...fillStyle,
            width: '100%',
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
            zIndex: -3,
        },
    })
}

const LozengeBigHeader = ({
    children,
    radius,
    styles,
    position,
}: {
    children: string
    radius: number
    styles: ReturnType<typeof getStyles>
    position?: Animated.AnimatedInterpolation
}) => {
    const [width, setWidth] = useState(0)

    return (
        <>
            <Animated.Text
                accessibilityRole="header"
                allowFontScaling={false}
                style={[
                    styles.text,
                    styles.header,
                    width &&
                        position && {
                            opacity: position.interpolate({
                                inputRange: [0, fadeLozengeAt],
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
                {...ariaHidden}
                onLayout={(ev: any) => {
                    setWidth(ev.nativeEvent.layout.width)
                }}
                style={[styles.lozengeContainer]}
            >
                <Animated.View
                    style={[
                        styles.square,
                        width &&
                            position && {
                                transform: [
                                    {
                                        translateX: position.interpolate({
                                            inputRange: [0, fadeLozengeAt],
                                            outputRange: [
                                                0,
                                                fadeLozengeAt * -1 -
                                                    width / 2 +
                                                    radius,
                                            ],
                                            extrapolate: 'clamp',
                                        }),
                                    },
                                    {
                                        scaleX: position.interpolate({
                                            inputRange: [0, fadeLozengeAt],
                                            outputRange: [1, 0],
                                            extrapolate: 'clamp',
                                        }),
                                    },
                                ],
                            },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.rightBubbleCap,
                        width &&
                            position && {
                                opacity: position.interpolate({
                                    inputRange: [
                                        0,
                                        clamp(width / 2 - radius, 0, width / 2),
                                        width / 2,
                                    ],
                                    outputRange: [1, 1, 0],
                                }),
                                transform: [
                                    {
                                        translateX: position.interpolate({
                                            inputRange: [0, fadeLozengeAt],
                                            outputRange: [
                                                0,
                                                fadeLozengeAt * -1 -
                                                    (width - radius),
                                            ],
                                            extrapolate: 'clamp',
                                        }),
                                    },
                                ],
                            },
                    ]}
                />
                <View style={[styles.leftBubbleCap]} />
            </Animated.View>
        </>
    )
}

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
            <LozengeBigHeader {...{ children, radius, styles, position }} />
            {position && (
                <Animated.View
                    {...ariaHidden}
                    style={[
                        styles.initialBubble,
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
            )}
        </Animated.View>
    )
}

export { Lozenge }
