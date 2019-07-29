import React from 'react'
import { View, StyleSheet } from 'react-native'
import { HeadlineKickerText } from 'src/components/styled-text'
import { longReadHeaderStyles, newsHeaderStyles } from '../styles'
import { metrics } from 'src/theme/spacing'
import { useArticle } from 'src/hooks/use-article'

export interface ArticleKickerProps {
    kicker: string
    type?: 'news' | 'longRead'
}

const styles = StyleSheet.create({
    kicker: { marginTop: metrics.vertical / 5 },
})

export const ArticleKicker = ({ kicker, type }: ArticleKickerProps) => {
    const [color] = useArticle()
    return (
        <View
            style={[
                type && type === 'news'
                    ? newsHeaderStyles.kicker
                    : longReadHeaderStyles.kicker,
            ]}
        >
            <HeadlineKickerText style={[styles.kicker, { color: color.main }]}>
                {kicker}
            </HeadlineKickerText>
        </View>
    )
}
