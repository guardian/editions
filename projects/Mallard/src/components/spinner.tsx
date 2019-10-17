import React, { useState, useEffect } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { ariaHidden } from 'src/helpers/a11y'
import { color } from 'src/theme/color'

const styles = StyleSheet.create({
    ball: {
        width: 20,
        height: 20,
        margin: 2,
        borderRadius: 100,
    },
    container: { flexDirection: 'row', padding: 5 },
})

const pillars = [
    color.palette.news.main,
    color.palette.opinion.main,
    color.palette.sport.main,
    color.palette.culture.main,
    color.palette.lifestyle.main,
]

const Ball = ({ color }: { color: string }) => {
    return (
        <Animated.View
            style={[styles.ball, { backgroundColor: color }]}
        ></Animated.View>
    )
}

const Spinner = () => {
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(true)
        }, 100)
        return () => clearTimeout(timer)
    }, [])
    return (
        <View accessibilityLabel={'Loading content'}>
            {visible && (
                <View {...ariaHidden} style={styles.container}>
                    {pillars.map((color, index) => (
                        <Ball key={index} color={color}></Ball>
                    ))}
                </View>
            )}
        </View>
    )
}

export { Spinner }
