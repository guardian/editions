import React from 'react'
import { View, StyleSheet } from 'react-native'
import { themeColors } from 'src/components/article/html/helpers/css'
import { ArticleTheme } from 'src/components/article/html/article'

const styles = StyleSheet.create({
    progressIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
})

type ProgressType = 'current' | 'small' | 'big'

type ProgressIndicatorProps = {
    imageCount: number
    currentIndex: number
    windowStart: number
    windowSize: number
}

const progressStyle = (type: ProgressType) => {
    const diameter = type === 'small' ? 5 : 10
    const colour =
        type === 'current' ? 'white' : themeColors(ArticleTheme.Dark).line
    return {
        width: diameter,
        height: diameter,
        borderRadius: diameter / 2,
        backgroundColor: colour,
        margin: 3,
    }
}

const ProgressCircle = ({ type }: { type: ProgressType }) => {
    return <View style={progressStyle(type)} />
}

export const ProgressIndicator = ({
    imageCount,
    currentIndex,
    windowStart,
    windowSize,
}: ProgressIndicatorProps) => {
    const current = currentIndex - windowStart
    const showStarter = windowStart > 0
    const showEnd = imageCount > windowStart + windowSize
    const circles = Array(windowSize)
        .fill('', 0)
        .map((e, index) =>
            (showStarter && index === 0) ||
            (showEnd && index === windowSize - 1)
                ? 'small'
                : index === current
                ? 'current'
                : 'big',
        )

    return (
        <View style={styles.progressIndicator}>
            {circles.map((t, i) => (
                <ProgressCircle type={t} key={`circle-${i}`} />
            ))}
        </View>
    )
}
