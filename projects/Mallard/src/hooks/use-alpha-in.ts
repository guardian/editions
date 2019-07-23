import { Animated, Easing } from 'react-native'
import { useState, useEffect } from 'react'

const useAlphaIn = (duration: number, easing = Easing.linear) => {
    const [value] = useState(new Animated.Value(0))

    useEffect(() => {
        Animated.timing(value, { duration, toValue: 1, easing }).start()
    }, [duration, easing, value])

    return value
}

export { useAlphaIn }
