import React from 'react'
import { Animated, Platform, StyleSheet, Text, View } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import { getFont } from 'src/theme/typography'
import { useLargeDeviceMemory } from 'src/hooks/use-config-provider'

const SLIDER_FRONT_HEIGHT = DeviceInfo.isTablet()
    ? Platform.OS === 'android'
        ? 100
        : 90
    : 60

interface ISliderTitle {
    title: string
    numOfItems: number
    color: string
    location?: 'article' | 'front'
    subtitle?: string
    position: Animated.AnimatedInterpolation
    startIndex: number
}

const styles = (color: string, location: string, isTablet: boolean) => {
    const titleShared = {
        color,
        fontFamily: getFont('titlepiece', 1).fontFamily,
    }

    const titleArticle = {
        ...titleShared,
        fontSize: isTablet ? 30 : 26,
    }

    const titleFront = {
        ...titleShared,
        fontSize: isTablet ? 50 : 28,
    }

    const title = location === 'article' ? titleArticle : titleFront

    const dotBuilder = (size: number, marginRight: number) => ({
        width: size,
        height: size,
        borderRadius: size / 2,
        marginRight,
    })

    const dotFront = isTablet ? dotBuilder(16, 7) : dotBuilder(10, 4)

    const dotArticle = dotBuilder(8, 2)

    const dot = location === 'article' ? dotArticle : dotFront

    return StyleSheet.create({
        container: {
            paddingLeft: location === 'front' ? 10 : 0,
            maxWidth: location === 'article' ? 800 : undefined,
            width: '100%',
            alignSelf: 'center',
        },
        titleContainer: {
            flexDirection: 'row',
        },
        title,
        subtitle: {
            ...title,
            color: 'grey', //TBC
        },
        dotsContainer: {
            flexDirection: 'row',
            paddingTop: 8,
        },
        dot,
        selected: {
            backgroundColor: color,
        },
    })
}

const SliderTitle = ({
    title,
    numOfItems,
    color,
    location = 'article',
    subtitle,
    position,
    startIndex,
}: ISliderTitle) => {
    const dots = []
    const isTablet = DeviceInfo.isTablet()
    const appliedStyle = styles(color, location, isTablet)
    // takes a key e.g. O:Top Stories and provides the end part
    const transformedSubtitle =
        subtitle && subtitle.split(':')[subtitle.split(':').length - 1]

    const newPos = startIndex
        ? Animated.subtract(position, startIndex)
        : position

    const largeDeviceMemory = useLargeDeviceMemory()
    const range = (i: number) =>
        largeDeviceMemory
            ? {
                  inputRange: [
                      i - 0.50000000001,
                      i - 0.5,
                      i,
                      i + 0.5,
                      i + 0.50000000001,
                  ],
                  outputRange: ['#DCDCDC', color, color, color, '#DCDCDC'],
              }
            : {
                  inputRange: [i - 1, i, i + 1],
                  outputRange: ['#DCDCDC', color, '#DCDCDC'],
              }

    for (let i = 0; i < numOfItems; i++) {
        let backgroundColor = newPos.interpolate({
            ...range(i),
            extrapolate: 'clamp',
        })

        dots.push(
            <Animated.View
                key={`${title}${i}`}
                style={[
                    appliedStyle.dot,
                    {
                        backgroundColor,
                    },
                ]}
            ></Animated.View>,
        )
    }

    return (
        <View style={appliedStyle.container}>
            <View style={appliedStyle.titleContainer}>
                <Text style={appliedStyle.title}>{title}</Text>
                {transformedSubtitle !== title && (
                    <Text style={appliedStyle.subtitle}>
                        {' '}
                        {transformedSubtitle}
                    </Text>
                )}
            </View>
            <View style={appliedStyle.dotsContainer}>{dots}</View>
        </View>
    )
}

export { SliderTitle, SLIDER_FRONT_HEIGHT, ISliderTitle }
