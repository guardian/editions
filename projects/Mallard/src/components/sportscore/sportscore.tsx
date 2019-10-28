import React from 'react'
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { getFont } from 'src/theme/typography'
import { color } from 'src/theme/color'

const styles = StyleSheet.create({
    background: {
        backgroundColor: color.palette.highlight.main,
        padding: 0,
        paddingBottom: 2,
        paddingHorizontal: metrics.horizontal / 3,
    },
    text: {
        letterSpacing: 0.25,
        ...getFont('headline', 0.5),
    },
})

const SportScore = ({
    style,
    sportScore,
}: {
    style?: StyleProp<ViewStyle>
    sportScore: string
}) => {
    return (
        <View
            accessibilityLabel={sportScore}
            style={[style, styles.background]}
        >
            <Text style={styles.text}>{sportScore}</Text>
        </View>
    )
}

export { SportScore }
