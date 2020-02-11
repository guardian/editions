import React from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { SliderSection } from './types'
import { ISliderTitle, SliderTitle } from './SliderTitle'

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

const SliderHeaderHighEnd = ({
    isShown,
    isAtTop,
    panResponder,
    sliderDetails,
}: {
    isShown: boolean
    isAtTop: boolean
    panResponder: any
    sliderDetails: ISliderTitle
}) => (
    <View
        style={[styles.slider, isAtTop ? styles.sliderAtTop : null]}
        {...panResponder.panHandlers}
    >
        <SliderTitle {...sliderDetails} />
    </View>
)

export { SliderHeaderHighEnd }
