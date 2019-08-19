import React, { useState, useEffect, ReactNode, useRef } from 'react'
import { Animated, StyleSheet, View, PanResponder } from 'react-native'
import { Header } from './header'
import { dismissAt } from './helpers'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'

/*
This is the swipey contraption that contains an article.
*/

const styles = StyleSheet.create({
    container: {
        flex: 0,
        flexShrink: 0,
        height: '100%',
        backgroundColor: color.background,
        borderTopLeftRadius: metrics.radius,
        borderTopRightRadius: metrics.radius,
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
}: {
    enabled: boolean
    children: ReactNode
    onDismiss: () => void
}) => {
    const [scrollY] = useState(() => new Animated.Value(1))
    let { current: blocked } = useRef(false)
    useEffect(() => {
        scrollY.addListener(({ value }) => {
            if (value < dismissAt * -1) {
                blocked = false
                Animated.timing(scrollY, {
                    toValue: 0,
                    duration: 200,
                }).start()
                onDismiss()
            }
        })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (ev, gestureState) => {
            if (gestureState.dy > 10) {
                blocked = true
            }
            return enabled && blocked
        },
        onPanResponderTerminationRequest: () => false,
        onShouldBlockNativeResponder: () => false,
        onPanResponderMove: (ev, gestureState) => {
            if (blocked) {
                scrollY.setValue(gestureState.dy * -1.5)
            }
        },
        onPanResponderEnd: (ev, gestureState) => {
            blocked = false
            Animated.timing(scrollY, {
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
            <Header
                {...{
                    scrollY,
                    onDismiss,
                }}
            />

            <View {...panResponder.panHandlers} style={[{ flex: 1 }]}>
                {children}
            </View>
        </Animated.View>
    )
}

SlideCard.defaultProps = {
    fadesHeaderIn: false,
}
