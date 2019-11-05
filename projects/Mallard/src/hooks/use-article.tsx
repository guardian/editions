import React, { createContext, useContext, useState } from 'react'
import { color } from '../theme/color'
import { ArticlePillar, ArticleType, Appearance, Collection } from '../common'
import { PillarColours } from '@guardian/pasteup/palette'
import { useIsUsingProdDevtools } from './use-settings'
import { DevTools } from 'src/hooks/article/dev-tools'

/*
  Exports
 */
const ArticlePillarContext = createContext<ArticlePillar>('neutral')
const ArticleTypeContext = createContext<ArticleType>(ArticleType.Article)

export const WithArticlePillar = ArticlePillarContext.Provider
export const WithArticleType = ArticleTypeContext.Provider

interface PropTypes {
    type: ArticleType
    pillar: ArticlePillar
    children: Element
}

export const Providers = ({ type, pillar, children }: PropTypes) => (
    <WithArticleType value={type}>
        <WithArticlePillar value={pillar}>{children}</WithArticlePillar>
    </WithArticleType>
)

const ProvidersAndDevtools = ({ type, pillar, children }: PropTypes) => {
    const [modifiedPillar, setPillar] = useState(pillar)
    const [modifiedType, setType] = useState(type)

    return (
        <>
            <Providers type={modifiedType} pillar={modifiedPillar}>
                {children}
            </Providers>
            <DevTools
                pillar={modifiedPillar}
                type={modifiedType}
                setPillar={setPillar}
                setType={setType}
            />
        </>
    )
}

export const WithArticle = (props: PropTypes) => {
    const isUsingProdDevtools = useIsUsingProdDevtools()

    if (isUsingProdDevtools) return <ProvidersAndDevtools {...props} />
    return <Providers {...props} />
}

const neutrals: PillarColours = {
    dark: color.palette.neutral[7],
    main: color.palette.neutral[7],
    bright: color.palette.neutral[20],
    pastel: color.palette.neutral[60],
    faded: color.palette.neutral[97],
}

export const getPillarColors = (pillar: ArticlePillar) =>
    pillar === 'neutral' ? neutrals : color.palette[pillar]

export const useArticle = (): [
    PillarColours,
    {
        pillar: ArticlePillar
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

export const getCollectionPillarOverride = (
    pillar: ArticlePillar,
    collection: Collection['key'],
) => {
    const col = collection.split(':').pop()
    return col === 'Obituaries' ? 'neutral' : pillar
}
