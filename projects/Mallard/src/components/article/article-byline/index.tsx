import React from 'react'
import { BodyCopy } from '../../styled-text'
import { StyleProp, TextStyle } from 'react-native'
import { useArticle } from 'src/hooks/use-article'

interface ArticleBylineProps {
    children: string
    style?: StyleProp<TextStyle>
}

const ArticleByline = ({ children, style }: ArticleBylineProps) => {
    const [color] = useArticle()

    return (
        <BodyCopy weight={'bold'} style={[{ color: color.main }, style]}>
            {children}
        </BodyCopy>
    )
}

export { ArticleByline }
