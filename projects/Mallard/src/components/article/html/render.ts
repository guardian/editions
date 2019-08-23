import {
    BlockElement,
    HTMLElement,
    MediaAtomElement,
    ImageElement,
    ArticlePillar,
    ArticleFeatures,
} from 'src/common'
import { metrics } from 'src/theme/spacing'
import { color } from 'src/theme/color'
import {
    generateAssetsFontCss,
    css,
    makeHtml,
    html,
} from '../../../helpers/webview'
import { PixelRatio } from 'react-native'
import { imagePath } from 'src/paths'
import { PillarColours } from '@guardian/pasteup/palette'
import { getPillarColors } from 'src/hooks/use-article'
import { getFont } from 'src/theme/typography'

export const EMBED_DOMAIN = 'https://embed.theguardian.com'

const getScaledFont = (...props: Parameters<typeof getFont>) => {
    const font = getFont(...props)
    return {
        ...font,
        lineHeight: font.lineHeight * PixelRatio.getFontScale(),
        fontSize: font.fontSize * PixelRatio.getFontScale(),
    }
}

const getScaledFontCss = (...props: Parameters<typeof getFont>) => {
    const font = getScaledFont(...props)
    return css`
        font-size: ${font.fontSize}px;
        line-height; ${font.lineHeight}px;
    `
}

const makeCss = (colors: PillarColours) => css`
    ${generateAssetsFontCss('GuardianTextEgyptian-Reg')}
    ${generateAssetsFontCss('GHGuardianHeadline-Regular')}
    * {
        margin: 0;
        padding: 0;
    }
    .drop-cap p:first-child:first-letter {
        font-family: 'GHGuardianHeadline-Regular';
        color: ${colors.main};
        float: left;
        font-size: ${getScaledFont('text', 1).lineHeight * 4}px;
        line-height: ${getScaledFont('text', 1).lineHeight * 4}px;
        display: inline-block;
        transform: scale(1.335) translateY(1px) translateX(-2px);
        transform-origin: left center;
        margin-right: 25px;
    }
    :root {
        ${getScaledFontCss('text', 1)}
    }
    #app {
        font-family: 'GuardianTextEgyptian-Reg';
        padding: ${metrics.vertical}px ${metrics.article.sides}px;
    }
    #app p,
    figure {
        margin-bottom: ${metrics.vertical * 2}px;
    }
    #app a {
        color: ${colors.main};
        text-decoration-color: ${colors.pastel};
    }
    figcaption {
        padding-top: 5px;
        font-size: ${12 * PixelRatio.getFontScale()}px;
        color: #767676;
        line-height: 1rem;
    }
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
                ${imageElement.caption} ${imageElement.credit}
            </figcaption>
        </figure>
    `
}

export const render = (
    article: BlockElement[],
    {
        pillar,
        features,
    }: {
        pillar: ArticlePillar
        features: ArticleFeatures[]
    },
) => {
    const generatedHtml = article
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
                    return renderImageElement(el)
                default:
                    ''
            }
        })
        .join('')
    const styles = makeCss(getPillarColors(pillar))
    return makeHtml({ styles, html: generatedHtml })
}
