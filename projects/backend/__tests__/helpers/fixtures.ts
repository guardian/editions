import {
    Article as IArticle,
    Content as IContent,
    WithKey,
} from '../../../common/src'
import { CArticle } from '../../capi/articles'
import { PublishedFurniture as IPublishedFurniture } from '../../fronts/issue'

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
        sportScore,
        bylineHtml,
    }: Partial<IContent> & WithKey,
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
    bylineHtml,
    showByline,
    showQuotedHeadline,
    mediaType,
    sportScore,
})

const Article = ({
    image,
    trailImage,
    byline = 'Mr CAPI',
    bylineHtml = '<a>Mr CAPI</> Senior Correspondent',
    standfirst = 'This story is great',
    elements = [],
    starRating,

    ...contentFields
}: Partial<IArticle> & WithKey): CArticle => ({
    ...Content('article', contentFields),
    path: contentFields.key,
    image,
    trailImage,
    byline,
    bylineHtml,
    standfirst,
    elements,
    starRating,
})

const PublishedFurniture = ({
    kicker,
    headlineOverride,
    trailTextOverride,
    bylineOverride,
    showByline = true,
    showQuotedHeadline = false,
    mediaType = 'Image',
    imageSrcOverride,
    sportScore,
    overrideArticleMainMedia = false,
    coverCardImages,
}: Partial<IPublishedFurniture> = {}): IPublishedFurniture => ({
    kicker,
    headlineOverride,
    trailTextOverride,
    bylineOverride,
    showByline,
    showQuotedHeadline,
    mediaType,
    imageSrcOverride,
    sportScore,
    overrideArticleMainMedia,
    coverCardImages,
})

export { Article, PublishedFurniture }
