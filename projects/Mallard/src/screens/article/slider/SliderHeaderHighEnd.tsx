import React, { useState, useEffect } from 'react'
import { Animated, StyleSheet, View, Easing } from 'react-native'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { SliderTitleProps, SliderTitle } from './SliderTitle'
import DeviceInfo from 'react-native-device-info'

const HEADER_HIGH_END_HEIGHT = DeviceInfo.isTablet() ? 50 : 40

const styles = StyleSheet.create({
    slider: {
        paddingTop: 2,
        paddingBottom: metrics.vertical,
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
    header: {
        position: 'absolute',
        height: HEADER_HIGH_END_HEIGHT,
        left: 0,
        right: 0,
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
    sliderDetails: SliderTitleProps
}) => {
    const [top] = useState(new Animated.Value(0))
    useEffect(() => {
        if (isShown) {
            Animated.timing(top, {
                toValue: 0,
                easing: Easing.out(Easing.ease),
                duration: 200,
            }).start()
        } else {
            Animated.timing(top, {
                toValue: -HEADER_HIGH_END_HEIGHT,
                easing: Easing.out(Easing.ease),
                duration: 200,
            }).start()
        }
    }, [isShown, top])

    return (
        <Animated.View style={[styles.header, { top }]}>
            <View
                style={[styles.slider, isAtTop ? styles.sliderAtTop : null]}
                {...panResponder.panHandlers}
            >
                <SliderTitle {...sliderDetails} />
            </View>
        </Animated.View>
    )
}

export { SliderHeaderHighEnd, HEADER_HIGH_END_HEIGHT }
