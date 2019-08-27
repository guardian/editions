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
import { WrapLayout } from '../wrap/wrap'

export const EMBED_DOMAIN = 'https://embed.theguardian.com'

const makeCss = ({
    colors,
    wrapLayout,
}: {
    colors: PillarColours
    wrapLayout: WrapLayout
}) => css`
    ${generateAssetsFontCss('GuardianTextEgyptian-Reg')}
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
    figcaption {
        padding-top: 5px;
        font-size: ${12 * PixelRatio.getFontScale()}px;
        color: #767676;
        line-height: 1rem;
    }
    .img-fill {
        width: ${wrapLayout.width}px
    }
    .img-side {
        float: right;
        width: ${wrapLayout.rail.width}px;
        margin-right: -${wrapLayout.width - wrapLayout.content.width}px
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
    { pillar, wrapLayout }: { pillar: ArticlePillar; wrapLayout: WrapLayout },
) => {
    const body = article
        .filter(
            el =>
                el.id === 'html' || el.id === 'media-atom' || el.id === 'image',
        )
        .map(el => {
            switch (el.id) {
                case 'html':
                    return (
                        el.html +
                        '<img src="https://cdn.bulbagarden.net/upload/thumb/4/49/Ash_Pikachu.png/1200px-Ash_Pikachu.png" class="img-fill" /><img src="https://cdn.bulbagarden.net/upload/thumb/4/49/Ash_Pikachu.png/1200px-Ash_Pikachu.png" class="img-side" />'
                    )
                case 'media-atom':
                    return renderMediaAtom(el)
                case 'image':
                    return renderImageElement(el)
                default:
                    return ''
            }
        })
        .join('')

    const html = `<div id="root"><main>${body}</main></root>`
    const styles = makeCss({ colors: getPillarColors(pillar), wrapLayout })
    return makeHtml({ styles, html })
}
