import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import { getFont } from 'src/theme/typography'

const SLIDER_FRONT_HEIGHT = DeviceInfo.isTablet() ? 80 : 60

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
            paddingHorizontal: location === 'article' ? 15 : 5,
            maxWidth: location === 'article' ? 825 : undefined,
            width: '100%',
            alignSelf: 'center',
        },
        title,
        dotsContainer: {
            flexDirection: 'row',
            paddingTop: 8,
            paddingBottom: 16,
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
    itemIndex,
    color,
    location = 'article',
}: {
    title: string
    numOfItems: number
    itemIndex: number
    color: string
    location?: 'article' | 'front'
}) => {
    const dots = []
    const isTablet = DeviceInfo.isTablet()
    const appliedStyle = styles(color, location, isTablet)

    for (let i = 0; i < numOfItems; i++) {
        const backgroundColor = i === itemIndex ? color : '#DCDCDC'
        dots.push(
            <View
                style={[
                    appliedStyle.dot,
                    {
                        backgroundColor,
                    },
                ]}
            ></View>,
        )
    }

    return (
        <View style={appliedStyle.container}>
            <Text style={appliedStyle.title}>{title}</Text>
            <View style={appliedStyle.dotsContainer}>{dots}</View>
        </View>
    )
}

export { SliderTitle, SLIDER_FRONT_HEIGHT }
