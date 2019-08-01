import React from 'react'
import { HeadlineText, HeadlineTextProps } from 'src/components/styled-text'
import { StyleSheet, StyleProp, TextStyle } from 'react-native'
import { metrics } from 'src/theme/spacing'

export type ArticleHeadlineProps = {
    children: any
    textStyle?: StyleProp<TextStyle>
} & Pick<HeadlineTextProps, 'weight'>

const styles = StyleSheet.create({
    headline: {
        marginRight: metrics.horizontal * 2,
        marginTop: metrics.vertical / 2,
    },
})

const ArticleHeadline = ({
    children,
    textStyle,
    weight,
}: ArticleHeadlineProps) => {
    return (
        <HeadlineText {...{ weight }} style={[styles.headline, textStyle]}>
            {children}
        </HeadlineText>
    )
}

export { ArticleHeadline }
