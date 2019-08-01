import React from 'react'
import { View, StyleSheet } from 'react-native'
import { HeadlineKickerText } from 'src/components/styled-text'
import { metrics } from 'src/theme/spacing'
import { useArticle } from 'src/hooks/use-article'
import { color } from 'src/theme/color'

export interface ArticleKickerProps {
    kicker: string
}

const styles = StyleSheet.create({
    kicker: {
        paddingBottom: metrics.vertical * 2,
        borderBottomWidth: 1,
        borderColor: color.palette.neutral[86],
        width: '100%',
        marginTop: metrics.vertical / 2,
    },
})

export const ArticleKicker = ({ kicker }: ArticleKickerProps) => {
    const [color] = useArticle()
    return (
        <View style={styles.kicker}>
            <HeadlineKickerText style={{ color: color.main }}>
                {kicker}
            </HeadlineKickerText>
        </View>
    )
}
