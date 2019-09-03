import {
    ArticleType,
    MediaType,
    Image,
    Content as IContent,
    BlockElement,
} from '../../../common/src'
import {
    PublishedImage,
    PublishedFurtniture as IPublishedFurtniture,
} from '../../fronts/issue'
import { CArticle } from '../../capi/articles'

interface ContentFields {
    key: string
    type?: string
    headline?: string
    kicker?: string
    articleType?: ArticleType
    trail?: string
    image?: Image
    standfirst?: string
    byline?: string
    bylineImages?: { thumbnail?: Image; cutout?: Image }
    showByline?: boolean
    showQuotedHeadline?: boolean
    mediaType?: MediaType
    slideshowImages?: Image[]
    sportScore?: string
}

const Content = <T extends string>(
    type: T,
    {
        key,
        headline = 'My amazing story',
        kicker = 'Big news',
        articleType,
        trail = 'Read this',
        image = { source: '', path: '' },
        standfirst,
        byline,
        bylineImages,
        showByline = true,
        showQuotedHeadline = false,
        mediaType = 'Image',
        slideshowImages,
        sportScore,
    }: ContentFields,
): IContent & { type: T } => ({
    key,
    type,
    headline,
    kicker,
    articleType,
    trail,
    image,
    standfirst,
    byline,
    bylineImages,
    showByline,
    showQuotedHeadline,
    mediaType,
    slideshowImages,
    sportScore,
})

type ArticleFields = {
    image?: Image
    byline?: string
    standfirst?: string
    elements?: BlockElement[]
    starRating?: number
} & ContentFields

const Article = ({
    image,
    byline = 'Mr CAPI',
    standfirst = 'This story is great',
    elements = [],
    starRating,
    ...contentFields
}: ArticleFields): CArticle => ({
    ...Content('article', contentFields),
    path: contentFields.key,
    image,
    byline,
    standfirst,
    elements,
    starRating,
})

interface PublishedFurnitureFields {
    kicker?: string
    headlineOverride?: string
    trailTextOverride?: string
    bylineOverride?: string
    showByline?: boolean
    showQuotedHeadline?: boolean
    mediaType?: MediaType
    imageSrcOverride?: PublishedImage
    slideshowImages?: PublishedImage[]
    sportScore?: string
}

const PublishedFurniture = ({
    kicker,
    headlineOverride,
    trailTextOverride,
    bylineOverride,
    showByline = true,
    showQuotedHeadline = false,
    mediaType = 'Image',
    imageSrcOverride,
    slideshowImages,
    sportScore,
}: PublishedFurnitureFields = {}): IPublishedFurtniture => ({
    kicker,
    headlineOverride,
    trailTextOverride,
    bylineOverride,
    showByline,
    showQuotedHeadline,
    mediaType,
    imageSrcOverride,
    slideshowImages,
    sportScore,
})

export { Article, PublishedFurniture }
