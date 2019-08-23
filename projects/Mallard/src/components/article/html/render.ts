import {
    BlockElement,
    HTMLElement,
    MediaAtomElement,
    ImageElement,
    ArticlePillar,
} from 'src/common'
import { metrics } from 'src/theme/spacing'
import { color } from 'src/theme/color'
import { generateAssetsFontCss, css, makeHtml } from '../../../helpers/webview'
import { PixelRatio } from 'react-native'
import { imagePath } from 'src/paths'
import { PillarColours } from '@guardian/pasteup/palette'
import { getPillarColors } from 'src/hooks/use-article'

export const EMBED_DOMAIN = 'https://embed.theguardian.com'

const makeCss = (colors: PillarColours) => css`
    ${generateAssetsFontCss('GuardianTextEgyptian-Reg')}
    * {
        margin: 0;
        padding: 0;
    }
    :root {
        font-size: ${17 * PixelRatio.getFontScale()}px;
        line-height; 1.4;
    }
    #app {
        font-family: 'GuardianTextEgyptian-Reg';
        padding: ${metrics.vertical}px ${metrics.article.sides}px;
    }
    #app p, figure {
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
    return `
    <figure style="overflow: hidden;">
        <iframe scrolling="no" src="${EMBED_DOMAIN}/embed/atom/media/${mediaAtomElement.atomId}" style="width: 100%; display: block;" frameborder="0"></iframe>
        <figcaption>${mediaAtomElement.title}</figcaption>
    </figure>`
}

const renderImageElement = (imageElement: ImageElement) => {
    const path = imagePath(imageElement.src)
    return `
        <figure style="overflow: hidden;">
            <img src="${path}" style="display: block; width: 100%; height: auto;" alt="${imageElement.alt}"/>
            <figcaption>${imageElement.caption} ${imageElement.credit}</figcaption>
        </figure>
    `
}

export const render = (
    article: BlockElement[],
    { pillar }: { pillar: ArticlePillar },
) => {
    const html = article
        .filter(
            el =>
                el.id === 'html' || el.id === 'media-atom' || el.id === 'image',
        )
        .map(el => {
            switch (el.id) {
                case 'html':
                    return el.html
                case 'media-atom':
                    return renderMediaAtom(el)
                case 'image':
                    return renderImageElement(el)
                default:
                    return ''
            }
        })
        .join('')
    const styles = makeCss(getPillarColors(pillar))
    return makeHtml({ styles, html })
}
