import { Animated, Easing } from 'react-native'
import { useRef, useLayoutEffect } from 'react'

const useAlphaIn = (
    duration: number,
    initialValue = 0,
    currentValue = 1,
    easing = Easing.linear,
) => {
    const animated = useRef(new Animated.Value(initialValue))

    console.log(duration, currentValue)

    useLayoutEffect(() => {
        console.log('effect')
        Animated.timing(animated.current, {
            duration,
            toValue: currentValue,
            easing,
            useNativeDriver: true,
        }).start()
    }, [duration, currentValue]) // ignore changes to easing

    return animated.current
}

export { useAlphaIn }
