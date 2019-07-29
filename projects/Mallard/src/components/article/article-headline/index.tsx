import React from 'react'
import { HeadlineText } from 'src/components/styled-text'
import { longReadHeaderStyles, newsHeaderStyles } from '../styles'

export interface ArticleHeadlineProps {
    children: any
    type: 'news' | 'longRead'
}

const ArticleHeadline = ({ children, type }: ArticleHeadlineProps) => {
    return (
        <HeadlineText
            style={[
                type === 'news'
                    ? newsHeaderStyles.headline
                    : longReadHeaderStyles.headline,
            ]}
        >
            {children}
        </HeadlineText>
    )
}

export { ArticleHeadline }
