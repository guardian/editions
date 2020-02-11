import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { getFont } from 'src/theme/typography'

const styles = (color: string, isTablet: boolean) =>
    StyleSheet.create({
        container: {
            paddingHorizontal: 15,
            maxWidth: 825,
            width: '100%',
            alignSelf: 'center',
        },
        title: {
            color,
            fontFamily: getFont('titlepiece', 1).fontFamily,
            fontSize: isTablet ? 30 : 26,
        },
        dotsContainer: {
            flexDirection: 'row',
            paddingTop: 8,
            paddingBottom: 16,
        },
        dot: {
            width: 12,
            height: 12,
            borderRadius: 6,
            marginRight: 2,
        },
        selected: {
            backgroundColor: color,
        },
    })

const SliderTitle = ({
    title,
    numOfItems,
    itemIndex,
    color,
    isTablet,
}: {
    title: string
    numOfItems: number
    itemIndex: number
    color: string
    isTablet: boolean
}) => {
    const dots = []
    const appliedStyle = styles(color, isTablet)

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

export { SliderTitle }
