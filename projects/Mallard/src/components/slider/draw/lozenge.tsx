import React, { useMemo, useState, ReactNode } from 'react'

import { color } from 'src/theme/color'
import { Animated, Text, StyleSheet, View } from 'react-native'
import { clamp } from 'src/helpers/math'
import { ariaHidden } from 'src/helpers/a11y'
import { metrics } from 'src/theme/spacing'

const fadeLozengeAt = 20

const bubbleStyle = {
    ...StyleSheet.absoluteFillObject,
    borderRadius: metrics.fronts.sliderRadius,
    width: metrics.fronts.sliderRadius * 2,
    zIndex: -2,
}

const commonStyles = StyleSheet.create({
    circle: {
        ...bubbleStyle,
        transform: [{ translateX: -1 }],
        backgroundColor: 'transparent',
        alignItems: 'center',
    },
    leftCap: {
        ...bubbleStyle,
        left: metrics.fronts.sliderRadius * -1,
    },
    rightCap: {
        ...bubbleStyle,
        left: 'auto',
        right: metrics.fronts.sliderRadius * -1,
    },
    square: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
    },
    header: {
        paddingHorizontal: metrics.fronts.sliderRadius * 0.75,
    },
    lozengeContainer: {
        ...StyleSheet.absoluteFillObject,
        left: metrics.fronts.sliderRadius,
        right: metrics.fronts.sliderRadius,
        zIndex: -3,
    },
    text: {
        color: color.textOverDarkBackground,
        fontSize: 22,
        height: metrics.fronts.sliderRadius * 2,
        lineHeight: metrics.fronts.sliderRadius * 1.75,
        alignItems: 'center',
        fontFamily: 'GTGuardianTitlepiece-Bold',
    },
})

const LozengeBigHeader = ({
    children,
    position,
    fill,
}: {
    children: string
    fill: string
    position?: Animated.AnimatedInterpolation
}) => {
    const [width, setWidth] = useState(0)

    return (
        <>
            <Animated.Text
                allowFontScaling={false}
                style={[
                    commonStyles.text,
                    commonStyles.header,
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
                style={[commonStyles.lozengeContainer]}
            >
                <Animated.View
                    style={[
                        commonStyles.square,
                        {
                            backgroundColor: fill,
                        },
                        position && {
                            opacity: position.interpolate({
                                inputRange: [
                                    0,
                                    fadeLozengeAt - 1,
                                    fadeLozengeAt,
                                ],
                                outputRange: [1, 1, 0],
                                extrapolate: 'clamp',
                            }),
                        },
                        position && {
                            transform: [
                                {
                                    translateX: position.interpolate({
                                        inputRange: [0, fadeLozengeAt],
                                        outputRange: [
                                            0,
                                            fadeLozengeAt * -1 -
                                                width / 2 +
                                                metrics.fronts.sliderRadius,
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
                        commonStyles.rightCap,
                        { backgroundColor: fill },
                        width &&
                            position && {
                                opacity: position.interpolate({
                                    inputRange: [
                                        0,
                                        clamp(
                                            width / 2 -
                                                metrics.fronts.sliderRadius,
                                            0,
                                            width / 2,
                                        ),
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
                                                    (width -
                                                        metrics.fronts
                                                            .sliderRadius),
                                            ],
                                            extrapolate: 'clamp',
                                        }),
                                    },
                                ],
                            },
                    ]}
                />
                <View
                    style={[commonStyles.leftCap, { backgroundColor: fill }]}
                />
            </Animated.View>
        </>
    )
}

const LozengeCircle = ({
    fill,
    children,
    style,
}: {
    fill: string
    children: string
    style?: any
    position?: Animated.AnimatedInterpolation
}) => {
    return (
        <Animated.View
            accessibilityLabel={children}
            accessibilityRole="header"
            style={[commonStyles.circle, { backgroundColor: fill }, style]}
        >
            <Text
                {...ariaHidden}
                allowFontScaling={false}
                style={[commonStyles.text]}
            >
                {children[0]}
            </Text>
        </Animated.View>
    )
}

const wrapperStyles = StyleSheet.create({
    root: {
        height: metrics.fronts.sliderRadius * 2,
        minWidth: metrics.fronts.sliderRadius * 2,
        paddingHorizontal: 0,
        alignItems: 'flex-start',
        alignSelf: 'flex-start',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flex: 0,
        width: 'auto',
    },
})

const LozengeWrapper = ({
    children,
    position,
}: {
    position?: Animated.AnimatedInterpolation
    children: ReactNode
}) => {
    return (
        <Animated.View
            style={[
                wrapperStyles.root,
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
            {children}
        </Animated.View>
    )
}

const Lozenge = ({
    fill,
    children,
    position,
}: {
    fill: string
    children: string
    position?: Animated.AnimatedInterpolation
}) => {
    return (
        <LozengeWrapper position={position}>
            <LozengeBigHeader {...{ children, fill, position }} />
            {position && (
                <LozengeCircle
                    fill={fill}
                    style={{
                        opacity: position.interpolate({
                            inputRange: [0, 10],
                            outputRange: [0, 1],
                            extrapolate: 'clamp',
                        }),
                    }}
                >
                    {children}
                </LozengeCircle>
            )}
        </LozengeWrapper>
    )
}

const MiniLozenge = ({
    fill,
    children,
    position,
}: {
    fill: string
    children: string
    position?: Animated.AnimatedInterpolation
}) => {
    return (
        <LozengeWrapper position={position}>
            <LozengeCircle fill={fill}>{children}</LozengeCircle>
        </LozengeWrapper>
    )
}

export { Lozenge, MiniLozenge }
