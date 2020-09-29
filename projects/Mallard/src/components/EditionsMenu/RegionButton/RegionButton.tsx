import React, { useState } from 'react'
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import { TitlepieceText } from 'src/components/styled-text'
import { color } from 'src/theme/color'
import { families } from 'src/theme/typography'
import { EDITIONS_MENU_TEXT_LEFT_PADDING } from '../EditionsMenu'

const styles = (selected: boolean) =>
    StyleSheet.create({
        container: {
            backgroundColor: selected
                ? color.primary
                : color.palette.neutral[97],
            paddingBottom: 32,
            paddingLeft: EDITIONS_MENU_TEXT_LEFT_PADDING,
            paddingTop: 4,
        },
        title: {
            fontSize: 20,
            lineHeight: 24,
            marginBottom: 5,
            color: selected ? 'white' : color.primary,
        },
        subTitle: {
            fontFamily: families.sans.regular,
            fontSize: 15,
            lineHeight: 18,
            color: selected ? 'white' : color.text,
        },
    })

const RegionButton = ({
    onPress,
    selected = false,
    subTitle,
    title,
}: {
    onPress: () => void
    selected?: boolean
    subTitle: string
    title: string
}) => {
    const [pressed, setPressed] = useState(false)
    const defaultStyles = styles(selected || pressed)

    return (
        <TouchableWithoutFeedback
            accessibilityRole="button"
            accessibilityLabel={`${title} - Regional Edition Button`}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            onPress={onPress}
        >
            <View style={defaultStyles.container}>
                <TitlepieceText style={defaultStyles.title}>
                    {title}
                </TitlepieceText>
                <Text style={defaultStyles.subTitle}>{subTitle}</Text>
            </View>
        </TouchableWithoutFeedback>
    )
}

export { RegionButton }
