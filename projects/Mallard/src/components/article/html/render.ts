import {
    css,
    generateAssetsFontCss,
    getScaledFont,
    getScaledFontCss,
    html,
    makeHtml,
    px,
} from 'src/helpers/webview'
import { getPillarColors } from 'src/hooks/use-article'
import { metrics } from 'src/theme/spacing'
import { families } from 'src/theme/typography'
import {
    ArticlePillar,
    ArticleType,
    BlockElement,
    CAPIArticle,
    Direction,
    ImageSize,
    Issue,
    MediaAtomElement,
} from '../../../common'
import { ArticleHeaderProps } from '../article-header/types'
import { ArticleTheme } from '../types/article'
import { WrapLayout } from '../wrap/wrap'
import { Arrow } from './arrow'
import { Header, headerStyles } from './header'
import { CssProps } from './helpers/props'
import { Image, imageStyles } from './images'
import { Line, lineStyles } from './line'
import { Pullquote, quoteStyles } from './pull-quote'
import { ratingStyles } from './rating'
import { color } from 'src/theme/color'

export const EMBED_DOMAIN = 'https://embed.theguardian.com'

const makeFontsCss = () => css`
    /* text */
    ${generateAssetsFontCss({ fontFamily: families.text.regular })}
    ${generateAssetsFontCss({
        fontFamily: families.text.bold,
        variant: {
            showsAsFamily: families.text.regular,
            weight: 700,
            style: 'normal',
        },
    })}
    ${generateAssetsFontCss({
        fontFamily: families.text.regularItalic,
        variant: {
            showsAsFamily: families.text.regular,
            weight: 400,
            style: 'italic',
        },
    })}

    /*headline*/
    ${generateAssetsFontCss({ fontFamily: families.headline.regular })}
    ${generateAssetsFontCss({
        fontFamily: families.headline.light,
        variant: {
            showsAsFamily: families.headline.regular,
            weight: 200,
            style: 'normal',
        },
    })}
    ${generateAssetsFontCss({
        fontFamily: families.headline.bold,
        variant: {
            showsAsFamily: families.headline.regular,
            weight: 700,
            style: 'normal',
        },
    })}
    ${generateAssetsFontCss({
        fontFamily: families.headline.medium,
        variant: {
            showsAsFamily: families.headline.regular,
            weight: 500,
            style: 'normal',
        },
    })}

    /* other fonts */
    ${generateAssetsFontCss({ fontFamily: families.sans.regular })}
    ${generateAssetsFontCss({ fontFamily: families.titlepiece.regular })}
    ${generateAssetsFontCss({
        fontFamily: families.icon.regular,
        extension: 'otf',
    })}
`

export const makeCss = ({ colors, wrapLayout }: CssProps) => css`
    ${makeFontsCss()}

    :root {
        --background: ${color.background};
        --text: ${color.text};
    }

    :root[data-theme="dark"] {
        --background: ${color.photoBackground};
        --text: ${color.textOverDarkBackground};
    }

    :root {
        ${getScaledFontCss('text', 1)}
        font-family: ${families.text.regular};
        background-color: var(--background);
        color: var(--text);
    }

    html, body {
        overflow-x: hidden;
    }
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    .drop-cap p:first-child:first-letter {
        font-family: 'GHGuardianHeadline-Regular';
        color: ${colors.main};
        float: left;
        font-size: ${px(getScaledFont('text', 1).lineHeight * 4)};
        line-height: ${px(getScaledFont('text', 1).lineHeight * 4)};
        display: inline-block;
        transform: scale(1.335) translateY(1px) translateX(-2px);
        transform-origin: left center;
        margin-right: 25px;
    }

    @keyframes fade {
        from {
            opacity: 0
        }

        to {
            opacity: 1;
        }
    }

    .app {
        padding: 0 ${px(metrics.article.sides)} ${px(metrics.vertical)};
        width: ${px(wrapLayout.width + metrics.article.sides * 2)};
        margin: auto;
        position: relative;
        animation-duration: .5s;
        animation-name: fade;
        animation-fill-mode: both;
    }
    main, .wrapper {
        max-width: ${px(wrapLayout.content.width + metrics.sides.sides / 2)};
    }
    .app p,
    figure {
        margin-bottom: ${px(metrics.vertical * 2)};
    }
    .app a {
        color: ${colors.main};
        text-decoration-color: ${colors.pastel};
    }
    * {
        margin: 0;
        padding: 0;
    }
    .app p {
      line-height: 1.4;
      margin-bottom: 15px;
    }
    .app h2 {
      font-size: ${px(getScaledFont('headline', 1).lineHeight)};
      line-height: ${px(getScaledFont('headline', 1).lineHeight * 1.1)};
      margin-bottom: ${px(metrics.vertical)};
      margin-top: ${px(metrics.vertical * 2.5)};
    }
    .content-wrap {
        position: relative;
        padding-top: ${px(metrics.vertical)};
    }
    .content-wrap .line {
        margin-right: ${px(metrics.article.sidesTablet * -1)};
    }
    ${quoteStyles({
        colors,
        wrapLayout,
    })}
    ${headerStyles({
        colors,
        wrapLayout,
    })}
    ${imageStyles({ colors, wrapLayout })}
    ${lineStyles({ colors, wrapLayout })}
    ${ratingStyles({ colors, wrapLayout })}
`

const renderMediaAtom = (mediaAtomElement: MediaAtomElement) => {
    return html`
        <figure class="image" style="overflow: hidden;">
            <iframe
                scrolling="no"
                src="${EMBED_DOMAIN}/embed/atom/media/${mediaAtomElement.atomId}"
                style="width: 100%; display: block;"
                frameborder="0"
            ></iframe>
            <figcaption>
                ${Arrow({ direction: Direction.top })} ${mediaAtomElement.title}
            </figcaption>
        </figure>
    `
}

interface ArticleContentProps {
    showMedia: boolean
    publishedId: Issue['publishedId'] | null
    imageSize: ImageSize
}

const renderArticleContent = (
    elements: BlockElement[],
    { showMedia, publishedId, imageSize }: ArticleContentProps,
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
                case 'image':
                    return showMedia && publishedId
                        ? Image({
                              imageElement: el,
                              publishedId,
                              imageSize,
                          })
                        : ''
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
        wrapLayout,
        showMedia,
        height,
        publishedId,
        showWebHeader,
        article,
        imageSize,
        type,
        theme,
    }: {
        pillar: ArticlePillar
        wrapLayout: WrapLayout
        height: number
        article: CAPIArticle
        type: ArticleType
        showWebHeader: boolean
        headerProps?: ArticleHeaderProps & { type: ArticleType }
        theme: ArticleTheme
    } & ArticleContentProps,
) => {
    let content, header
    switch (article.type) {
        case 'picture':
            header = Header({
                publishedId,
                type: ArticleType.Picture,
                headline: article.headline,
                byline: article.byline,
                bylineHtml: article.bylineHtml,
            })
            content =
                article.image &&
                publishedId &&
                Image({
                    imageElement: {
                        src: article.image,
                        id: 'image',
                        role: 'immersive',
                    },
                    publishedId,
                    imageSize,
                })
            break
        default:
            header = Header({ ...article, type, publishedId })
            content = renderArticleContent(elements, {
                showMedia,
                publishedId,
                imageSize,
            })
            break
    }

    const styles = makeCss({ colors: getPillarColors(pillar), wrapLayout })
    const body = html`
        ${showWebHeader && article && header}
        <div class="content-wrap">
            ${showWebHeader && Line({ zIndex: 999 })}
            <main style="padding-top:${px(height)}">
                ${content}
            </main>
        </div>
    `
    return makeHtml({ styles, body, rootProps: `data-theme="${theme}"` })
}
