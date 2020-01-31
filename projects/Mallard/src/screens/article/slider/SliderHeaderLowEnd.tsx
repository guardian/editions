import React, { useEffect, useState } from 'react'
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { BasicArticleHeader } from '../header'
import { SliderSection } from './types'
import { SliderBarWrapper } from './SliderBarWrapper'

const ANDROID_HEADER_HEIGHT = 130

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
        sections,
        sliderPosition,
        width,
        goNext,
        goPrevious,
    }: {
        isShown: boolean
        isAtTop: boolean
        sections: SliderSection[]
        sliderPosition: Animated.AnimatedInterpolation
        width: number
        goNext: () => void
        goPrevious: () => void
    } & NavigationInjectedProps) => {
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
                    toValue: -ANDROID_HEADER_HEIGHT,
                    easing: Easing.out(Easing.ease),
                    duration: 200,
                }).start()
            }
        }, [isShown, top])

        return (
            <Animated.View style={[styles.androidHeader, { top }]}>
                <BasicArticleHeader />
                <View
                    style={[styles.slider, isAtTop ? styles.sliderAtTop : null]}
                >
                    <SliderBarWrapper
                        sections={sections}
                        sliderPosition={
                            Platform.OS === 'android'
                                ? sliderPosition
                                : Animated.divide(
                                      sliderPosition,
                                      new Animated.Value(width),
                                  )
                        }
                        width={width}
                        goNext={goNext}
                        goPrevious={goPrevious}
                    />
                </View>
            </Animated.View>
        )
    },
)

export { SliderHeaderLowEnd, ANDROID_HEADER_HEIGHT }
