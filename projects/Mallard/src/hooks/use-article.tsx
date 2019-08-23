import React, { createContext, useContext, useState } from 'react'
import { color } from '../theme/color'
import { ArticlePillar, ArticleType, Appearance } from '../common'
import { PillarColours } from '@guardian/pasteup/palette'
import { useSettingsValue } from './use-settings'
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

export const Providers = ({ type, pillar, children }: PropTypes) => {
    const isUsingProdDevtools = useSettingsValue.isUsingProdDevtools()
    if (isUsingProdDevtools)
        return <ProvidersAndDevtools {...{ type, pillar, children }} />
    return (
        <WithArticleType value={type}>
            <WithArticlePillar value={pillar}>{children}</WithArticlePillar>
        </WithArticleType>
    )
}

const ProvidersAndDevtools = ({ type, pillar, children }: PropTypes) => {
    const [modifiedPillar, setPillar] = useState(pillar)
    const [modifiedType, setType] = useState(type)

    return (
        <>
            <DevTools
                pillar={modifiedPillar}
                type={modifiedType}
                setPillar={setPillar}
                setType={setType}
            />
            <Providers type={modifiedType} pillar={modifiedPillar}>
                {children}
            </Providers>
        </>
    )
}

export const WithArticle = (props: PropTypes) => {
    const isUsingProdDevtools = useSettingsValue.isUsingProdDevtools()
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
