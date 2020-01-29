import React from 'react'
import { Animated, StyleSheet } from 'react-native'
import { Button } from 'src/components/button/button'
import { Slider } from 'src/components/slider'
import { useIsPreview } from 'src/hooks/use-settings'
import { SliderSection } from './types'

type SliderBarProps = {
    section: SliderSection
    sliderPosition: Animated.AnimatedInterpolation
    width: number
    isFirst: boolean
    goNext: () => void
    goPrevious: () => void
}

const styles = StyleSheet.create({
    firstSlider: {
        width: '100%',
        flexShrink: 0,
        flexGrow: 1,
    },
    innerSlider: {
        ...StyleSheet.absoluteFillObject,
    },
})

const SliderSectionBar = ({
    section,
    sliderPosition,
    width,
    isFirst,
    goNext,
    goPrevious,
}: SliderBarProps) => {
    const sliderPos = sliderPosition
        .interpolate({
            inputRange: [
                section.startIndex,
                section.startIndex + section.items - 1,
            ],
            outputRange: [
                section.startIndex,
                section.startIndex + section.items - 1,
            ],
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        })
        .interpolate({
            inputRange: [
                section.startIndex,
                section.startIndex + section.items - 1,
            ],
            outputRange: [0, 1],
        })

    const xValue = sliderPosition.interpolate({
        inputRange: [
            section.startIndex - 1,
            section.startIndex,
            section.startIndex + section.items - 1,
            section.startIndex + section.items,
        ],
        outputRange: [width, 0, 0, -width],
        extrapolate: 'clamp',
    })

    const isPreview = useIsPreview()

    return (
        <Animated.View
            style={[
                isFirst ? styles.firstSlider : styles.innerSlider,
                {
                    transform: [
                        {
                            translateX: xValue,
                        },
                    ],
                },
                { flexDirection: 'row' },
            ]}
        >
            {isPreview && <Button onPress={goPrevious}>&larr;</Button>}
            <Slider
                small={false}
                title={section.title}
                fill={section.color}
                stops={2}
                position={sliderPos}
            />
            {isPreview && <Button onPress={goNext}>&rarr;</Button>}
        </Animated.View>
    )
}

export { SliderSectionBar }
