import React from 'react'
import { View, StyleSheet } from 'react-native'
import { HeadlineKickerText } from 'src/components/styled-text'
import { newsHeaderStyles } from '../styles'
import { metrics } from 'src/theme/spacing'
import { useArticle } from 'src/hooks/use-article'

export interface ArticleKickerProps {
    kicker: string
    type?: 'news'
}

const styles = StyleSheet.create({
    kicker: { marginTop: metrics.vertical / 5 },
})

export const ArticleKicker = ({ kicker }: ArticleKickerProps) => {
    const [color] = useArticle()
    return (
        <View style={newsHeaderStyles.kicker}>
            <HeadlineKickerText style={[styles.kicker, { color: color.main }]}>
                {kicker}
            </HeadlineKickerText>
        </View>
    )
}
