import { ArticleType, BlockElement, HTMLElement } from '../../Apps/common/src'

const DROP_CAP_ARTICLE_TYPES: ArticleType[] = [
    ArticleType.Feature,
    ArticleType.Immersive,
    ArticleType.Longread,
]

const articleShouldHaveDropCap = ({
    articleType,
}: {
    articleType?: ArticleType
}) => articleType && DROP_CAP_ARTICLE_TYPES.includes(articleType)

const isHTMLElement = (el?: BlockElement): el is HTMLElement =>
    !!el && el.id === 'html'

export { articleShouldHaveDropCap, isHTMLElement }
