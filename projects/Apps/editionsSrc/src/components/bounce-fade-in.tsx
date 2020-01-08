import React from 'react'
import { Animated } from 'react-native'
import { useAlphaIn } from '../hooks/use-alpha-in'

const FadeIn = ({
    children,
    duration,
}: {
    children: React.ReactNode
    duration: number
}) => {
    const opacity = useAlphaIn(duration)
    return (
        <Animated.View
            style={{
                opacity,
            }}
        >
            {children}
        </Animated.View>
    )
}

export { FadeIn }
