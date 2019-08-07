import React, { useMemo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
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

const getRatingAsText = (rating: number) => {
    let ratingAsText = ['☆', '☆', '☆', '☆', '☆']
    for (let i = 0; i < rating; i++) {
        ratingAsText[i] = '★'
    }
    if (rating % 1 > 0) {
        ratingAsText[rating - (rating % 1)] = ''
    }
    return ratingAsText
}

const Stars = ({ rating }: { rating: number }) => {
    const ratingAsText = useMemo(() => getRatingAsText(rating), [rating])
    return (
        <View
            accessibilityLabel={`${rating.toString()} stars`}
            style={styles.background}
        >
            <Text style={styles.text} accessible={false}>
                {ratingAsText.join('')}
            </Text>
        </View>
    )
}

export { Stars }
