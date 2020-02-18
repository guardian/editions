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

const FIRST_SUBTITLE_DATE = new Date('2020-02-17').getTime()

interface SliderTitleProps {
    title: string
    numOfItems: number
    color: string
    location?: 'article' | 'front'
    subtitle?: string
    position: Animated.AnimatedInterpolation
    startIndex?: number
    editionDate: Date | undefined //temporary until we have subtitles for the last 30 editions
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
        editionDate,
    }: SliderTitleProps) => {
        const isTablet = DeviceInfo.isTablet()
        const appliedStyle = styles(color, location, isTablet)
        // takes a key e.g. O:Top Stories and provides the end part
        const transformedSubtitle =
            subtitle && subtitle.split(':')[subtitle.split(':').length - 1]
        const showSubtitle =
            transformedSubtitle !== title &&
            // this check (and associated editionDate prop) can be removed one month after HIDE_SUBTITLE_BEFORE
            // this is to hide subtitles on past issues created before subtitles were a thing
            (!editionDate || editionDate.getTime() > FIRST_SUBTITLE_DATE)

        return (
            <View style={appliedStyle.container}>
                <View style={appliedStyle.titleContainer}>
                    <Text style={appliedStyle.title}>{title}</Text>
                    {showSubtitle && (
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
