import { ArticlePillar, BlockElement, MediaAtomElement } from 'src/common'
import { getPillarColors } from 'src/hooks/use-article'
import { metrics } from 'src/theme/spacing'
import {
    css,
    generateAssetsFontCss,
    getScaledFont,
    getScaledFontCss,
    html,
    makeHtml,
    px,
} from 'src/helpers/webview'
import { WrapLayout } from '../wrap/wrap'
import { CssProps } from './helpers/props'
import { Image, imageStyles } from './images'
import { quoteStyles, Pullquote } from './pull-quote'
import { families } from 'src/theme/typography'
import { Issue } from '../../../common'

export const EMBED_DOMAIN = 'https://embed.theguardian.com'

export const makeCss = ({ colors, wrapLayout }: CssProps) => css`
    ${generateAssetsFontCss(families.text.regular)}
    ${generateAssetsFontCss(families.headline.regular)}
    ${generateAssetsFontCss(families.sans.regular)}
    ${generateAssetsFontCss(families.titlepiece.regular)}
    ${quoteStyles({
        colors,
        wrapLayout,
    })}
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
        margin-bottom: 25px;
    }
    :root {
        ${getScaledFontCss('text', 1)}
        font-family: ${families.text.regular};
    }
    #app {
        padding: ${px(metrics.vertical)} ${px(metrics.article.sides)};
        width: ${px(wrapLayout.width + metrics.article.sides * 2)};
        margin: auto;
        position: relative;
    }
    main {
        width: ${px(wrapLayout.content.width)};
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

    ${imageStyles({ colors, wrapLayout })}
`

const renderMediaAtom = (mediaAtomElement: MediaAtomElement) => {
    return html`
        <figure style="overflow: hidden;">
            <iframe
                scrolling="no"
                src="${EMBED_DOMAIN}/embed/atom/media/${mediaAtomElement.atomId}"
                style="width: 100%; display: block;"
                frameborder="0"
            ></iframe>
            <figcaption>${mediaAtomElement.title}</figcaption>
        </figure>
    `
}

export const render = (
    article: BlockElement[],
    {
        pillar,
        wrapLayout,
        showMedia,
        height,
        publishedId,
    }: {
        pillar: ArticlePillar
        wrapLayout: WrapLayout
        showMedia: boolean
        height: number
        publishedId: Issue['publishedId'] | null
    },
) => {
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
        <main style="padding-top:${px(height)}">${content}</main>
    `
    return makeHtml({ styles, body })
}
