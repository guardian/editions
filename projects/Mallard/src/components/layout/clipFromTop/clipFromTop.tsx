import React, { useState, ReactNode } from 'react'
import { Animated, Dimensions, Platform, StyleSheet } from 'react-native'
import MaskedView from '@react-native-community/masked-view'

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

const MaskClipFromTop = ({ children, from, easing }: PropTypes) => {
    const [windowHeight] = useState(() => Dimensions.get('window').height)
    const targetHeightScale = (windowHeight / from) * 2
    return (
        <MaskedView
            style={clipperStyles.flex}
            maskElement={
                <Animated.View
                    style={[
                        { height: from },
                        {
                            transform: [
                                {
                                    scaleY: easing.interpolate({
                                        inputRange: [0, 0.33, 1],
                                        outputRange: [
                                            1,
                                            targetHeightScale / 4,
                                            targetHeightScale,
                                        ],
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
        </MaskedView>
    )
}

const ClipFromTop = ({ children, from, easing }: MaybePropTypes) => {
    /* android struggles animating masks sadface */
    if (Platform.OS !== 'ios' || from == undefined || easing == undefined)
        return <>{children}</>
    return (
        <MaskClipFromTop from={from} easing={easing}>
            {children}
        </MaskClipFromTop>
    )
}

export { ClipFromTop }
