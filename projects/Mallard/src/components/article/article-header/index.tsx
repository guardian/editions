import React from 'react'
import { ArticleType } from 'src/common'
import { LongReadHeader } from './long-read-header'
import { NewsHeader } from './news-header'
import { OpinionHeader } from './opinion-header'
import { ReviewHeader } from './review-header'
import { ImmersiveHeader } from './immersive-header'
import { ArticleHeaderProps } from './types'
import { ObituaryHeader } from './obituary-header'

type HeaderT = (props: ArticleHeaderProps) => JSX.Element

const headers: {
    [key in ArticleType]?: HeaderT
} = {
    [ArticleType.Immersive]: ImmersiveHeader,
    [ArticleType.Opinion]: OpinionHeader,
    [ArticleType.Review]: ReviewHeader,
    [ArticleType.Longread]: LongReadHeader,
    [ArticleType.Obituary]: ObituaryHeader,
    [ArticleType.Series]: LongReadHeader,
}

const ArticleHeader = ({
    type,
    ...headerProps
}: ArticleHeaderProps & { type: ArticleType }) => {
    if (type in headers) {
        const Header = headers[type] as HeaderT
        return <Header {...headerProps} />
    }
    return <NewsHeader {...headerProps} />
}

export { ArticleHeader }
