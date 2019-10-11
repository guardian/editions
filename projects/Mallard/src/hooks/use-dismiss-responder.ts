import { useMemo, useState, useCallback } from 'react'
import { PanResponder, Animated } from 'react-native'
import { safeInterpolation } from 'src/helpers/math'
import { useNavigatorPosition } from 'src/navigation/helpers/transition'

export const useDismissResponder = (onDismiss: () => void) => {
    const [scrollY] = useState(() => new Animated.Value(0))
    const pos = useNavigatorPosition()

    const attachPos = useCallback(() => {
        Animated.timing(pos, {
            toValue: scrollY.interpolate({
                inputRange: safeInterpolation([0, 60]),
                outputRange: safeInterpolation([1, 0.8]),
            }) as Animated.Value,
            duration: 0,
            useNativeDriver: true,
        }).start()
    }, [pos]) // eslint-disable-line react-hooks/exhaustive-deps

    const panResponder = useMemo(
        () =>
            PanResponder.create({
                onMoveShouldSetPanResponder: (ev, gestureState) => {
                    if (gestureState.dy > 1) {
                        attachPos()
                        return true
                    }
                    return false
                },
                onStartShouldSetPanResponder: () => false,
                onPanResponderMove: Animated.event([
                    null,
                    {
                        dy: scrollY,
                    },
                ]),
                onPanResponderEnd: (ev, gestureState) => {
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
            }),
        [onDismiss, scrollY, attachPos],
    )

    return {
        scrollY,
        panResponder,
    }
}
