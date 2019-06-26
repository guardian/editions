import React, { useState, useEffect, ReactNode } from 'react'
import {
    Animated,
    Dimensions,
    Easing,
    Platform,
    StyleSheet,
} from 'react-native'
import MaskedView from '@react-native-community/masked-view'

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

const ActualClipper = ({ children, from }: PropTypes) => {
    /* 
    This is part of the transition from fronts and it positions 
    the article where it should on screen
    */
    const [windowHeight] = useState(() => Dimensions.get('window').height)
    const [height] = useState(
        () => new Animated.Value((from * 2) / windowHeight),
    )
    useEffect(() => {
        Animated.sequence([
            Animated.delay(50),
            Animated.timing(height, {
                toValue: 2,
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

const Clipper = ({ children, from }: MaybePropTypes) => {
    /* android struggles animating masks sadface */
    if (Platform.OS !== 'ios' || from == undefined) return <>{children}</>
    return <ActualClipper from={from}>{children}</ActualClipper>
}

export { Clipper }
