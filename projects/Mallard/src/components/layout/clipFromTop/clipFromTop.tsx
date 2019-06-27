import React, { useState, useEffect, ReactNode } from 'react'
import {
    Animated,
    Dimensions,
    Easing,
    Platform,
    StyleSheet,
} from 'react-native'
import MaskedView from '@react-native-community/masked-view'

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
}

interface PropTypes extends MaybePropTypes {
    from: number
}

const MaskClipFromTop = ({ children, from }: PropTypes) => {
    const [windowHeight] = useState(() => Dimensions.get('window').height)
    const [height] = useState(
        () => new Animated.Value((from * 2) / windowHeight),
    )
    useEffect(() => {
        Animated.sequence([
            Animated.delay(75),
            Animated.timing(height, {
                toValue: 2.25,
                duration: 300,
                easing: Easing.inOut(Easing.linear),
                useNativeDriver: true,
            }),
        ]).start()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <MaskedView
            style={clipperStyles.flex}
            maskElement={
                <Animated.View
                    style={[
                        {
                            transform: [
                                { translateY: windowHeight / -2 },
                                { scaleY: height },
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

const ClipFromTop = ({ children, from }: MaybePropTypes) => {
    /* android struggles animating masks sadface */
    if (Platform.OS !== 'ios' || from == undefined) return <>{children}</>
    return <MaskClipFromTop from={from}>{children}</MaskClipFromTop>
}

export { ClipFromTop }
