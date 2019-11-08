import { html, makeHtml } from 'src/helpers/webview'
import { getPillarColors } from 'src/hooks/use-article'
import {
    ArticlePillar,
    ArticleType,
    BlockElement,
    CAPIArticle,
    ImageSize,
    Issue,
} from '../../../common'
import { ArticleTheme } from '../types/article'
import { Header, ArticleHeaderProps } from './components/header'
import { Image } from './components/images'
import { Line } from './components/line'
import { Pullquote } from './components/pull-quote'
import { makeCss } from './css'
import { renderMediaAtom } from './components/media-atoms'
import { useImagePath } from 'src/hooks/use-image-paths'
import { Image as TImage } from '../../../../../common/src'

interface ArticleContentProps {
    showMedia: boolean
    publishedId: Issue['publishedId'] | null
    imageSize: ImageSize
}

const PictureArticleContent = (image: TImage) => {
    const path = useImagePath({
        path: image.path,
        source: image.source,
    })
    return Image({
        imageElement: {
            src: image,
            id: 'image',
            role: 'immersive',
        },
        path,
    })
}

const renderArticleContent = (
    elements: BlockElement[],
    { showMedia, publishedId }: ArticleContentProps,
) => {
    return elements
        .map(el => {
            switch (el.id) {
                case 'html':
                    if (el.hasDropCap) {
                        return html`
                            <div class="drop-cap">
                                ${el.html}
                            </div>
                        `
                    }
                    return el.html
                case 'media-atom':
                    return showMedia ? renderMediaAtom(el) : ''
                case 'image': {
                    const path = useImagePath({
                        path: el.src.path,
                        source: el.src.source,
                    })
                    return publishedId
                        ? Image({
                              imageElement: el,
                              path,
                          })
                        : ''
                }
                case 'pullquote':
                    return Pullquote({
                        cite: el.html,
                        role: el.role || 'inline',
                        ...el,
                    })
                default:
                    return ''
            }
        })
        .join('')
}

export const renderArticle = (
    elements: BlockElement[],
    {
        pillar,
        showMedia,
        topPadding,
        publishedId,
        showWebHeader,
        article,
        imageSize,
        type,
        theme,
    }: {
        pillar: ArticlePillar
        topPadding: number
        article: CAPIArticle
        type: ArticleType
        showWebHeader: boolean
        headerProps?: ArticleHeaderProps & { type: ArticleType }
        theme: ArticleTheme
    } & ArticleContentProps,
) => {
    let content, header
    const canBeShared = article.webUrl != null
    switch (article.type) {
        case 'picture':
            header = Header({
                publishedId,
                type: ArticleType.Gallery,
                headline: article.headline,
                byline: article.byline,
                bylineHtml: article.bylineHtml,
                showMedia,
                canBeShared,
            })
            if (article.image && publishedId) {
                content = PictureArticleContent(article.image)
            }
            break
        case 'gallery':
            header = Header({
                publishedId,
                type: ArticleType.Gallery,
                headline: article.headline,
                byline: article.byline,
                bylineHtml: article.bylineHtml,
                image: article.image,
                showMedia,
                canBeShared,
            })
            content = renderArticleContent(elements, {
                showMedia,
                publishedId,
                imageSize,
            })
            break
        default:
            header = Header({
                ...article,
                type,
                publishedId,
                showMedia,
                canBeShared,
            })
            content = renderArticleContent(elements, {
                showMedia,
                publishedId,
                imageSize,
            })
            break
    }

    const styles = makeCss({
        colors: getPillarColors(pillar),
        theme,
    })
    const body = html`
        ${showWebHeader && article && header}
        <div class="content-wrap">
            ${showWebHeader && Line({ zIndex: 999 })}
            <main>
                ${content}
            </main>
        </div>
    `
    return makeHtml({ styles, body, topPadding })
}
