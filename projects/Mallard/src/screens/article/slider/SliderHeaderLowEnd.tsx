import React, { useEffect, useState } from 'react'
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { BasicArticleHeader } from '../header'
import { supportsAnimation } from 'src/helpers/features'
import { SliderTitle, ISliderTitle } from './SliderTitle'
import DeviceInfo from 'react-native-device-info'

const ANDROID_HEADER_HEIGHT = DeviceInfo.isTablet()
    ? Platform.OS === 'ios'
        ? 160
        : 140
    : 135

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
    androidHeader: {
        position: 'absolute',
        height: ANDROID_HEADER_HEIGHT,
        left: 0,
        right: 0,
    },
})

const SliderHeaderLowEnd = withNavigation(
    ({
        isShown,
        isAtTop,
        sliderDetails,
    }: {
        isShown: boolean
        isAtTop: boolean
        sliderDetails: ISliderTitle
    } & NavigationInjectedProps) => {
        const [top] = useState(new Animated.Value(0))
        if (supportsAnimation()) {
            useEffect(() => {
                if (isShown) {
                    Animated.timing(top, {
                        toValue: 0,
                        easing: Easing.out(Easing.ease),
                        duration: 200,
                    }).start()
                } else {
                    Animated.timing(top, {
                        toValue: -ANDROID_HEADER_HEIGHT,
                        easing: Easing.out(Easing.ease),
                        duration: 200,
                    }).start()
                }
            }, [isShown, top])
        }

        return (
            <Animated.View style={[styles.androidHeader, { top }]}>
                <BasicArticleHeader />
                <View
                    style={[styles.slider, isAtTop ? styles.sliderAtTop : null]}
                >
                    <SliderTitle {...sliderDetails} />
                </View>
            </Animated.View>
        )
    },
)

export { SliderHeaderLowEnd, ANDROID_HEADER_HEIGHT }
