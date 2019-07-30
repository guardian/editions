import React, { useState, ReactNode } from 'react'
import { Animated, Dimensions, StyleSheet } from 'react-native'
import MaskedView from '@react-native-community/masked-view'
import { supportsAnimatedClipView } from 'src/helpers/features'

/*
This is part of the transition from articles to fronts
and it crops the bottom end of the article so it feels
as if it's coming out of its card
*/

const clipperStyles = StyleSheet.create({
    flex: { flex: 0 },
    bg: { backgroundColor: 'black' },
})

interface MaybePropTypes {
    children: ReactNode
    from?: number
    easing?: Animated.AnimatedInterpolation
}

interface PropTypes extends MaybePropTypes {
    from: number
    easing: Animated.AnimatedInterpolation
}

const topOffset = 100
const AnimatedMaskedView = Animated.createAnimatedComponent(MaskedView)

const MaskClipFromTop = ({ children, from, easing }: PropTypes) => {
    const [windowHeight] = useState(() => Dimensions.get('window').height)
    const targetHeightScale = (windowHeight / from) * 2
    return (
        <AnimatedMaskedView
            style={[
                clipperStyles.flex,
                {
                    transform: [
                        {
                            translateY: easing.interpolate({
                                inputRange: [0, 1],
                                outputRange: [topOffset * -1, 0],
                            }),
                        },
                    ],
                },
            ]}
            maskElement={
                <Animated.View
                    style={[
                        { height: from },
                        {
                            transform: [
                                {
                                    translateY: easing.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [topOffset, 0],
                                    }),
                                },
                                {
                                    scaleY: easing.interpolate({
                                        inputRange: [0, 0.5, 1],
                                        outputRange: [1, 1, targetHeightScale],
                                    }),
                                },
                            ],
                        },
                        clipperStyles.flex,
                        clipperStyles.bg,
                    ]}
                />
            }
        >
            {children}
        </AnimatedMaskedView>
    )
}

const ClipFromTop = ({ children, from, easing }: MaybePropTypes) => {
    /* android struggles animating masks sadface */
    if (!supportsAnimatedClipView() || from == undefined || easing == undefined)
        return <>{children}</>
    return (
        <MaskClipFromTop from={from} easing={easing}>
            {children}
        </MaskClipFromTop>
    )
}

export { ClipFromTop }
