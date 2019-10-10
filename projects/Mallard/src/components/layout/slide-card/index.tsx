import React, { useState, useEffect, ReactNode, useRef } from 'react'
import { Animated, StyleSheet, View, PanResponder } from 'react-native'
import { Header } from './header'
import { dismissAt } from './helpers'
import { safeInterpolation } from 'src/helpers/math'

/*
This is the swipey contraption that contains an article.
*/

const styles = StyleSheet.create({
    container: {
        flex: 0,
        flexShrink: 0,
        height: '100%',
        overflow: 'hidden',
    },
    flexGrow: {
        flexGrow: 1,
    },
})

export const SlideCard = ({
    enabled,
    children,
    onDismiss,
    getPosition,
}: {
    enabled: boolean
    children: ReactNode
    onDismiss: () => void
    getPosition: () => Animated.Value
}) => {
    const [scrollY] = useState(() => new Animated.Value(0))

    useEffect(() => {
        Animated.timing(getPosition(), {
            toValue: scrollY.interpolate({
                inputRange: safeInterpolation([0, 60]),
                outputRange: safeInterpolation([1, 0.8]),
            }) as Animated.Value,
            duration: 0,
            useNativeDriver: true,
        }).start()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Animated.View style={[styles.container]}>
            <View style={[{ flex: 1 }]}>
                <Header
                    {...{
                        scrollY,
                        onDismiss,
                    }}
                />
                {children}
            </View>
        </Animated.View>
    )
}

SlideCard.defaultProps = {
    fadesHeaderIn: false,
}
