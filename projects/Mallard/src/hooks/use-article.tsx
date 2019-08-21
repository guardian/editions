import React, { createContext, useContext } from 'react'
import { color } from '../theme/color'
import { PillarFromPalette, ArticleType, Appearance } from '../common'
import { PillarColours } from '@guardian/pasteup/palette'

/*
  Exports
 */
const ArticlePillarContext = createContext<PillarFromPalette>('neutral')
const ArticleTypeContext = createContext<ArticleType>(ArticleType.Article)

export const WithArticlePillar = ArticlePillarContext.Provider
export const WithArticleType = ArticleTypeContext.Provider

export const WithArticle = ({
    type,
    pillar,
    children,
}: {
    type: ArticleType
    pillar: PillarFromPalette
    children: Element
}) => (
    <WithArticleType value={type}>
        <WithArticlePillar value={pillar}>{children}</WithArticlePillar>
    </WithArticleType>
)

const neutrals: PillarColours = {
    dark: color.palette.neutral[7],
    main: color.palette.neutral[7],
    bright: color.palette.neutral[20],
    pastel: color.palette.neutral[60],
    faded: color.palette.neutral[97],
}

export const getPillarColors = (pillar: PillarFromPalette) =>
    pillar === 'neutral' ? neutrals : color.palette[pillar]

export const useArticle = (): [
    PillarColours,
    {
        pillar: PillarFromPalette
        type: ArticleType
    },
] => {
    const pillar = useContext(ArticlePillarContext)
    const type = useContext(ArticleTypeContext)
    return [
        getPillarColors(pillar),
        {
            pillar,
            type,
        },
    ]
}

export const getAppearancePillar = (app: Appearance) =>
    app.type === 'custom' ? 'neutral' : app.name
