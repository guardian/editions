import { useArticle } from 'src/hooks/use-article'
import { ArticleType } from 'src/common'

export const useIsOpinionCard = () => {
    const [, { pillar, type }] = useArticle()
    return pillar === 'opinion' && type === ArticleType.Opinion
}

export const useIsSportCard = () => {
    const [, { pillar }] = useArticle()
    return pillar === 'sport'
}
