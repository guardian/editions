import React from 'react'
import { Animated, Platform, StyleSheet, Text, View } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import { getFont } from 'src/theme/typography'
import { SliderDots } from './SliderDots'

const SLIDER_FRONT_HEIGHT = DeviceInfo.isTablet()
    ? Platform.OS === 'android'
        ? 100
        : 70
    : 60

interface SliderTitleProps {
    title: string
    numOfItems: number
    color: string
    location?: 'article' | 'front'
    subtitle?: string
    position: Animated.AnimatedInterpolation
    startIndex?: number
}

const styles = (color: string, location: string, isTablet: boolean) => {
    const titleShared = {
        color,
        fontFamily: getFont('titlepiece', 1).fontFamily,
    }

    const titleArticle = {
        ...titleShared,
        fontSize: isTablet ? 30 : 20,
    }

    const titleFront = {
        ...titleShared,
        fontSize: isTablet ? 38 : 28,
    }

    const title = location === 'article' ? titleArticle : titleFront

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
    })
}

const SliderTitle = React.memo(
    ({
        title,
        numOfItems,
        color,
        location = 'article',
        subtitle,
        position,
        startIndex,
    }: SliderTitleProps) => {
        const isTablet = DeviceInfo.isTablet()
        const appliedStyle = styles(color, location, isTablet)
        // takes a key e.g. O:Top Stories and provides the end part
        const transformedSubtitle =
            subtitle && subtitle.split(':')[subtitle.split(':').length - 1]

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
                {numOfItems > 1 && (
                    <SliderDots
                        numOfItems={numOfItems}
                        color={color}
                        location={location}
                        position={position}
                        startIndex={startIndex}
                    />
                )}
            </View>
        )
    },
)

export { SliderTitle, SLIDER_FRONT_HEIGHT, SliderTitleProps }
