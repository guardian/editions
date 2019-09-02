import {
    ArticleFeatures,
    ArticlePillar,
    BlockElement,
    MediaAtomElement,
} from 'src/common'
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

export const EMBED_DOMAIN = 'https://embed.theguardian.com'

export const makeCss = ({ colors, wrapLayout }: CssProps) => css`
    ${generateAssetsFontCss('GuardianTextEgyptian-Reg')}
    ${generateAssetsFontCss('GHGuardianHeadline-Regular')}
    ${generateAssetsFontCss('GuardianTextSans-Regular')}
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
        font-family: 'GuardianTextEgyptian-Reg';
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

export const renderCaption = (imageElement: ImageElement) =>
    [imageElement.caption, imageElement.credit].filter(s => !!s).join(' ')

const renderImageElement = (imageElement: ImageElement) => {
    const path = imagePath(imageElement.src)
    return html`
        <figure style="overflow: hidden;">
            <img
                src="${path}"
                style="display: block; width: 100%; height: auto;"
                alt="${imageElement.alt}"
            />
            <figcaption>
                ${renderCaption(imageElement)}
            </figcaption>
        </figure>
    `
}

export const render = (
    article: BlockElement[],
    {
        pillar,
        features,
        wrapLayout,
    }: {
        pillar: ArticlePillar
        features: ArticleFeatures[]
        wrapLayout: WrapLayout
    },
) => {
    const content = article
        .filter(
            el =>
                el.id === 'html' || el.id === 'media-atom' || el.id === 'image',
        )
        .map((el, i) => {
            switch (el.id) {
                case 'html':
                    if (
                        i === 0 &&
                        features.includes(ArticleFeatures.HasDropCap)
                    ) {
                        return html`
                            <div class="drop-cap">
                                ${el.html}
                            </div>
                        `
                    }
                    return el.html
                case 'media-atom':
                    return renderMediaAtom(el)
                case 'image':
                    return Image({ imageElement: el })
                default:
                    return ''
            }
        })
        .join('')

    const styles = makeCss({ colors: getPillarColors(pillar), wrapLayout })
    const body = html`
        <main>${content}</main>
    `
    return makeHtml({ styles, body })
}
