import { PillarColours } from '@guardian/pasteup/palette'
import {
    ArticleFeatures,
    ArticlePillar,
    BlockElement,
    ImageElement,
    MediaAtomElement,
} from 'src/common'
import { getPillarColors } from 'src/hooks/use-article'
import { imagePath } from 'src/paths'
import { metrics } from 'src/theme/spacing'
import {
    css,
    generateAssetsFontCss,
    getScaledFont,
    getScaledFontCss,
    html,
    makeHtml,
    px,
} from '../../../helpers/webview'
import { WrapLayout } from '../wrap/wrap'
import { Image, imageStyles } from './images'

export const EMBED_DOMAIN = 'https://embed.theguardian.com'

const makeCss = ({
    colors,
    wrapLayout,
}: {
    colors: PillarColours
    wrapLayout: WrapLayout
}) => css`
    ${generateAssetsFontCss('GuardianTextEgyptian-Reg')}
    ${generateAssetsFontCss('GHGuardianHeadline-Regular')}
    ${generateAssetsFontCss('GuardianTextSans-Regular')}
    * {
        margin: 0;
        padding: 0;
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
    #root {
        overflow: hidden;
    }
    main {
        float: left;
        width: ${wrapLayout.content.width}px;
        padding: 0 {metrics.article.sides}px
    }
    * {
        margin: 0;
        padding: 0;
    }
    .img-fill {
        width: ${wrapLayout.width}px
    }
    .img-side {
        float: right;
        width: ${wrapLayout.rail.width}px;
        margin-right: -${wrapLayout.width - wrapLayout.content.width}px
    }
    ${imageStyles}
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
        features,
        wrapLayout,
    }: {
        pillar: ArticlePillar
        features: ArticleFeatures[]
        wrapLayout: WrapLayout
    },
) => {
    const body = article
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

    const generatedHtml = html`<div id="root"><main>${body}</main></root>`

    const styles = makeCss({ colors: getPillarColors(pillar), wrapLayout })
    return makeHtml({ styles, html: generatedHtml })
}
