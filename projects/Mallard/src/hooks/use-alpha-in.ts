import { Animated, Easing } from 'react-native'
import { useEffect, useRef } from 'react'

const useAlphaIn = (
    duration: number,
    initialValue = 0,
    currentValue = 1,
    easing = Easing.linear,
) => {
    const animated = useRef(new Animated.Value(initialValue))

    useEffect(() => {
        Animated.timing(animated.current, {
            duration,
            toValue: currentValue,
            easing,
            useNativeDriver: true,
        }).start()
    }, [duration, currentValue, easing]) // ignore changes to easing

    return animated.current
}

export { useAlphaIn }
