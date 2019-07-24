import React, { ReactNode } from 'react'
import { StyleSheet, ScrollView, View, Animated } from 'react-native'
import { useAppAppearance } from 'src/theme/appearance'
import { useAlphaIn } from 'src/hooks/use-alpha-in'

const styles = StyleSheet.create({
    container: { flex: 1 },
})

const ScrollContainer = ({ children }: { children: ReactNode }) => {
    const { backgroundColor } = useAppAppearance()
    return (
        <ScrollView style={[styles.container, { backgroundColor }]}>
            {children}
        </ScrollView>
    )
}

/**
 * the translateY and transitionDuration allows us to translate the view along the y axis
 * in an animated way, which is useful for obscuring parts of the view when it's only partially
 * in view, i.e.: sliding the header out of the way when the issue screen is poking out the
 * bottom of the window when viewing the issue list
 */
const Container = ({
    children,
    translateY,
    transitionDuration,
}: {
    children: ReactNode
    translateY: number
    transitionDuration: number
}) => {
    const { backgroundColor } = useAppAppearance()
    const value = useAlphaIn(transitionDuration, translateY, translateY)
    return (
        <Animated.View
            style={[
                styles.container,
                { backgroundColor },
                { transform: [{ translateY: value }] },
            ]}
        >
            {children}
        </Animated.View>
    )
}

export { Container, ScrollContainer }
