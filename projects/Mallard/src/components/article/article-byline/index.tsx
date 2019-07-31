import React from 'react'
import { BodyCopy } from '../../styled-text'
import { StyleProp, TextStyle, StyleSheet } from 'react-native'
import { useArticle } from 'src/hooks/use-article'
import { metrics } from 'src/theme/spacing'

interface ArticleBylineProps {
    children: string
    style?: StyleProp<TextStyle>
}

const styles = StyleSheet.create({
    base: { paddingBottom: metrics.vertical },
})

const ArticleByline = ({ children, style }: ArticleBylineProps) => {
    const [color] = useArticle()

    return (
        <BodyCopy
            weight={'bold'}
            style={[styles.base, { color: color.main }, style]}
        >
            {children}
        </BodyCopy>
    )
}

export { ArticleByline }
