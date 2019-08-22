import React from 'react'
import { ArticleType } from 'src/common'
import { LongReadHeader } from './long-read-header'
import { NewsHeader } from './news-header'
import { OpinionHeader } from './opinion-header'
import { ReviewHeader } from './review-header'
import { ImmersiveHeader } from './immersive-header'
import { ArticleHeaderProps } from './types'
import { UiBodyCopy } from '../../styled-text'

type HeaderT = (props: ArticleHeaderProps) => JSX.Element

const headers: {
    [key in ArticleType]?: HeaderT
} = {
    [ArticleType.Immersive]: ImmersiveHeader,
    [ArticleType.Opinion]: OpinionHeader,
    [ArticleType.Review]: ReviewHeader,
    [ArticleType.Longread]: LongReadHeader,
}

const ArticleHeader = ({
    type,
    ...headerProps
}: ArticleHeaderProps & { type: ArticleType }) => {
    if (type in headers && headers[type]) {
        const Header = headers[type] as HeaderT
    }
    return <UiBodyCopy>{type}</UiBodyCopy>
    return <NewsHeader {...headerProps} />
}

export { ArticleHeader }
