import {
    ArticlePillar,
    BlockElement,
    MediaAtomElement,
    ArticleType,
    Direction,
} from '../../../common'
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
import { Issue } from '../../../common'
import { ArticleHeaderProps } from '../article-header/types'
import { WrapLayout } from '../wrap/wrap'
import { Header, headerStyles } from './header'
import { CssProps } from './helpers/props'
import { Image, imageStyles } from './images'
import { Pullquote, quoteStyles } from './pull-quote'
import { lineStyles, Line } from './line'
import { useImageSize } from 'src/hooks/use-image-size'
import { ratingStyles } from './rating'
import { Arrow } from './arrow'

export const EMBED_DOMAIN = 'https://embed.theguardian.com'

export const makeCss = ({ colors, wrapLayout }: CssProps) => css`
    ${generateAssetsFontCss(families.text.regular)}
    ${generateAssetsFontCss(families.icon.regular)}
    ${generateAssetsFontCss(families.headline.light)}
    ${generateAssetsFontCss(families.headline.regular)}
    ${generateAssetsFontCss(families.headline.bold)}
    ${generateAssetsFontCss(families.sans.regular)}
    ${generateAssetsFontCss(families.titlepiece.regular)}
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
    :root {
        ${getScaledFontCss('text', 1)}
        font-family: ${families.text.regular};
    }

    @keyframes fade {
        from {
            opacity: 0
        }

        to {
            opacity: 1;
        }
    }

    #app {
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
    #app p,
    figure {
        margin-bottom: ${px(metrics.vertical * 2)};
    }
    #app a {
        color: ${colors.main};
        text-decoration-color: ${colors.pastel};
    }
    * {
        margin: 0;
        padding: 0;
    }
    #app p {
      margin-bottom: 15px;
    }
    #app h2 {
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

export const useRenderedHTML = (
    article: BlockElement[],
    {
        pillar,
        wrapLayout,
        showMedia,
        height,
        publishedId,
        showWebHeader,
        headerProps,
    }: {
        pillar: ArticlePillar
        wrapLayout: WrapLayout
        showMedia: boolean
        height: number
        publishedId: Issue['publishedId'] | null
        showWebHeader: boolean
        headerProps?: ArticleHeaderProps & { type: ArticleType }
    },
) => {
    const { imageSize } = useImageSize()
    const content = article
        .map((el, i) => {
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

    const styles = makeCss({ colors: getPillarColors(pillar), wrapLayout })
    const body = html`
        ${showWebHeader &&
            headerProps &&
            Header({ ...headerProps, publishedId })}
        <div class="content-wrap">
            ${showWebHeader && Line({ zIndex: 999 })}
            <main style="padding-top:${px(height)}">
                ${content}
            </main>
        </div>
    `
    return makeHtml({ styles, body })
}
