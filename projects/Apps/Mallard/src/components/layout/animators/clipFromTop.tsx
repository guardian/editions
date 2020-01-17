import React, { ReactNode } from 'react'
import { Animated, Dimensions, StyleSheet } from 'react-native'
import MaskedView from '@react-native-community/masked-view'
import { supportsAnimatedClipView } from 'src/helpers/features'
import { metrics } from 'src/theme/spacing'
import { safeInterpolation } from 'src/helpers/math'

/*
This is part of the transition from articles to fronts
and it crops the bottom end of the article so it feels
as if it's coming out of its card
*/

const clipperStyles = StyleSheet.create({
    flex: { flex: 1 },
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

const AnimatedMaskedView = Animated.createAnimatedComponent(MaskedView)

const MaskClipFromTop = ({ children, from, easing }: PropTypes) => {
    const windowHeight = Dimensions.get('window').height
    const targetHeightScale = from / windowHeight
    return (
        <AnimatedMaskedView
            style={[clipperStyles.flex]}
            maskElement={
                <Animated.View
                    style={[
                        { height: windowHeight },
                        {
                            borderRadius: easing.interpolate({
                                inputRange: [0, 1],
                                outputRange: safeInterpolation([
                                    0,
                                    metrics.radius,
                                ]),
                            }),
                        },
                        {
                            transform: [
                                {
                                    translateY: easing.interpolate({
                                        inputRange: [0, 0.5, 1, 10],
                                        outputRange: safeInterpolation([
                                            (windowHeight - from) / -2,
                                            (windowHeight - from) / -2,
                                            0,
                                            (windowHeight - from) / -2,
                                        ]),
                                    }),
                                },
                                {
                                    scaleY: easing.interpolate({
                                        inputRange: [0, 0.5, 1, 10],
                                        outputRange: safeInterpolation([
                                            targetHeightScale,
                                            targetHeightScale,
                                            1,
                                            10,
                                        ]),
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
