import React, { useState, useEffect, ReactNode, useRef } from 'react'
import { Animated, StyleSheet, View, PanResponder } from 'react-native'
import { Header } from './header'
import { dismissAt } from './helpers'

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
    let { current: blocked } = useRef(false)

    useEffect(() => {
        Animated.timing(getPosition(), {
            toValue: scrollY.interpolate({
                inputRange: [0, 60],
                outputRange: [1, 0.8],
            }),
            duration: 0,
            useNativeDriver: true,
        }).start()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (ev, gestureState) => {
            if (gestureState.dy > 10) {
                blocked = true
                if (enabled && gestureState.vy > 1) {
                    blocked = false
                    onDismiss()
                    scrollY.stopAnimation()
                }
            }
            return enabled && blocked
        },
        onPanResponderTerminationRequest: () => false,
        onShouldBlockNativeResponder: () => false,
        onPanResponderMove: Animated.event([
            null,
            {
                dy: scrollY,
            },
        ]),
        onPanResponderEnd: (ev, gestureState) => {
            blocked = false
            if (gestureState.dy > 50) {
                onDismiss()
                scrollY.stopAnimation()
                return
            }
            Animated.timing(scrollY, {
                useNativeDriver: true,
                toValue: 0,
                duration: 200,
            }).start()
        },
    })

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [
                        {
                            translateY: scrollY.interpolate({
                                inputRange: [dismissAt * -1, 0],
                                outputRange: [dismissAt, 0],
                                extrapolate: 'clamp',
                            }),
                        },
                    ],
                },
            ]}
        >
            <View {...panResponder.panHandlers} style={[{ flex: 1 }]}>
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
