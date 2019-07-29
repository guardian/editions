import React from 'react'
import { BodyCopy } from '../../styled-text'
import { useArticleAppearance } from 'src/theme/appearance'
import { StyleProp, TextStyle } from 'react-native'

interface ArticleBylineProps {
    children: string
    style?: StyleProp<TextStyle>
}

const ArticleByline = ({ children, style }: ArticleBylineProps) => {
    const { appearance } = useArticleAppearance()
    return (
        <BodyCopy
            weight={'bold'}
            style={[appearance.text, appearance.byline, style]}
        >
            {children}
        </BodyCopy>
    )
}

export { ArticleByline }
