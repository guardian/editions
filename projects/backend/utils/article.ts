import { ArticleType, BlockElement, HTMLElement } from '../../common/src'
import { CArticle } from '../capi/articles'

const DROP_CAP_ARTICLE_TYPES: ArticleType[] = [
    ArticleType.Feature,
    ArticleType.Immersive,
    ArticleType.Longread,
]

const articleShouldHaveDropCap = ({ articleType }: CArticle) =>
    articleType && DROP_CAP_ARTICLE_TYPES.includes(articleType)

const isHTMLElement = (el?: BlockElement): el is HTMLElement =>
    !!el && el.id === 'html'

export { articleShouldHaveDropCap, isHTMLElement }
