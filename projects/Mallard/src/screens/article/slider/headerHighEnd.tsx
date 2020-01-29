import React from 'react'
import { Animated, StyleSheet, View, PanResponder } from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { SliderBar } from './sliderBar'
import { SliderSection } from './types'

const styles = StyleSheet.create({
    slider: {
        paddingVertical: metrics.vertical,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: color.line,
        backgroundColor: color.background,
        paddingHorizontal: metrics.horizontal,
    },
    sliderAtTop: {
        borderBottomColor: color.background,
    },
})

const HighEndHeader = ({
    isAtTop,
    sections,
    sliderPosition,
    width,
    goNext,
    goPrevious,
    panResponder,
}: {
    isShown: boolean
    isAtTop: boolean
    sections: SliderSection[]
    sliderPosition: Animated.AnimatedInterpolation
    width: number
    goNext: () => void
    goPrevious: () => void
    panResponder: any
}) => (
    <View
        style={[styles.slider, isAtTop ? styles.sliderAtTop : null]}
        {...panResponder.panHandlers}
    >
        <SliderBar
            goNext={goNext}
            goPrevious={goPrevious}
            sections={sections}
            sliderPosition={Animated.divide(
                sliderPosition,
                new Animated.Value(width),
            )}
            width={width}
        />
    </View>
)

export { HighEndHeader }
