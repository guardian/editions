import React from 'react'
import { BodyCopy } from '../../styled-text'
import { useArticleAppearance } from 'src/theme/appearance'

interface ArticleBylineProps {
    children: string
}

const ArticleByline = ({ children }: ArticleBylineProps) => {
    const { appearance } = useArticleAppearance()
    return (
        <BodyCopy weight={'bold'} style={[appearance.text, appearance.byline]}>
            {children}
        </BodyCopy>
    )
}

export { ArticleByline }
