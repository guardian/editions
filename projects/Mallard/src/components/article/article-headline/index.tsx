import React from 'react'
import { HeadlineText } from 'src/components/styled-text'
import { newsHeaderStyles } from '../styles'

export interface ArticleHeadlineProps {
    children: any
}

const ArticleHeadline = ({ children }: ArticleHeadlineProps) => {
    return (
        <HeadlineText style={newsHeaderStyles.headline}>
            {children}
        </HeadlineText>
    )
}

export { ArticleHeadline }
