import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useArticleAppearance } from 'src/theme/appearance'
import { HeadlineKickerText } from 'src/components/styled-text'
import { longReadHeaderStyles, newsHeaderStyles } from '../styles'
import { metrics } from 'src/theme/spacing'

export interface ArticleKickerProps {
    kicker: string
    type?: 'news' | 'longRead'
}

const styles = StyleSheet.create({
    kicker: { marginTop: metrics.vertical / 5 },
})

export const ArticleKicker = ({ kicker, type }: ArticleKickerProps) => {
    const { appearance } = useArticleAppearance()
    return (
        <View
            style={[
                type && type === 'news'
                    ? newsHeaderStyles.kicker
                    : longReadHeaderStyles.kicker,
                appearance.backgrounds,
            ]}
        >
            <HeadlineKickerText
                style={[appearance.text, appearance.kicker, styles.kicker]}
            >
                {kicker}
            </HeadlineKickerText>
        </View>
    )
}
