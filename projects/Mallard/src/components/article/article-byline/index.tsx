import React from 'react'
import { BodyCopy } from '../../styled-text'
import { useArticleAppearance, useArticleToneColor } from 'src/theme/appearance'

interface ArticleBylineProps {
    children: string
}

const ArticleByline = ({ children }: ArticleBylineProps) => {
    const { appearance } = useArticleAppearance()
    const color = useArticleToneColor()
    return (
        <BodyCopy
            weight={'bold'}
            style={[appearance.text, appearance.byline, { color }]}
        >
            {children}
        </BodyCopy>
    )
}

export { ArticleByline }
