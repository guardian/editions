import React, { Children } from 'react'
import { HeadlineText } from 'src/components/styled-text'
import { useArticleAppearance } from 'src/theme/appearance'
import { longReadHeaderStyles, newsHeaderStyles } from '../styles'

export interface ArticleHeadlineProps {
    children: string
    type: 'news' | 'longRead'
}

const ArticleHeadline = ({ children, type }: ArticleHeadlineProps) => {
    const { appearance } = useArticleAppearance()
    return (
        <HeadlineText
            style={[
                type === 'news'
                    ? newsHeaderStyles.headline
                    : longReadHeaderStyles.headline,
                appearance.text,
                appearance.headline,
            ]}
        >
            {children}
        </HeadlineText>
    )
}

export { ArticleHeadline }
