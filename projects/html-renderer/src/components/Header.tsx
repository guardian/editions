import React from 'react'
import { ArticleHeader } from './headers/ArticleHeader'
import { ObitHeader } from './headers/ObitHeader'
import { ImmersiveHeader } from './headers/ImmersiveHeader'
import { AnalysisHeader } from './headers/AnalysisHeader'
import { ReviewHeader } from './headers/ReviewHeader'
import { InterviewHeader } from './headers/InterviewHeader'
import { Article } from '../model/Article'
import { Pillar } from '../model/Pillar'

export const Header = ({
    article,
    pillar,
}: {
    article: Article
    pillar: Pillar
}) => {
    switch (article.type) {
        case 'default': {
            return <ArticleHeader article={article} />
        }
        case 'obit': {
            return <ObitHeader article={article} />
        }
        case 'longread': {
            return (
                <ImmersiveHeader
                    article={article}
                    showKicker
                    backgroundColor="#000"
                    color="#fff"
                />
            )
        }
        case 'immersive': {
            return (
                <ImmersiveHeader
                    showBottomLine
                    article={article}
                    backgroundColor="#fff"
                />
            )
        }
        case 'analysis': {
            return <AnalysisHeader article={article} underline />
        }
        case 'opinion': {
            return <AnalysisHeader article={article} quote />
        }
        case 'review': {
            return <ReviewHeader article={article} />
        }
        case 'interview': {
            return (
                <InterviewHeader
                    article={article}
                    brightBg={pillar === 'sport'}
                />
            )
        }
    }
}
