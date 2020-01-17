import React, { useMemo } from 'react'
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
        ...getFont('icon', 1),
    },
})

export const getRatingAsText = (rating: number) =>
    ['☆', '☆', '☆', '☆', '☆'].map((s, index) => {
        if (index + 1 <= rating) {
            return '★'
        }
        if (index + 0.01 <= rating) {
            return ''
        }
        return s
    })

const Stars = ({
    style,
    rating,
}: {
    style?: StyleProp<ViewStyle>
    rating: number
}) => {
    const ratingAsText = useMemo(() => getRatingAsText(rating), [rating])
    return (
        <View
            accessibilityLabel={`${rating.toString()} stars`}
            style={[style, styles.background]}
        >
            <Text style={styles.text} accessible={false}>
                {ratingAsText.join('')}
            </Text>
        </View>
    )
}

export { Stars }
