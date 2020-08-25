import { ArticleType, BlockElement, HTMLElement } from '../../Apps/common/src'

const DROP_CAP_ARTICLE_TYPES: ArticleType[] = [
    ArticleType.Immersive,
    ArticleType.Longread,
    ArticleType.Interview,
]

const articleShouldHaveDropCap = ({
    articleType,
}: {
    articleType?: ArticleType
}) => articleType && DROP_CAP_ARTICLE_TYPES.includes(articleType)

const isHTMLElement = (el?: BlockElement): el is HTMLElement =>
    !!el && el.id === 'html'

export { articleShouldHaveDropCap, isHTMLElement }
