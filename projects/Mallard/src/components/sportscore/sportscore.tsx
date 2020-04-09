import React from 'react'
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
        ...getFont('headline', 0.5),
    },
    stars: {
        flex: 0,
    },
    rating: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 0,
        bottom: 0,
    },
})

const SportScore = ({
    sportScore,
    type,
}: {
    sportScore: string
    type?: 'stars' | 'rating'
}) => (
    <View
        accessibilityLabel={sportScore}
        style={[
            styles.background,
            type === 'stars' && styles.stars,
            type === 'rating' && styles.rating,
        ]}
    >
        <Text style={styles.text}>{sportScore}</Text>
    </View>
)

export { SportScore }
