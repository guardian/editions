import { BlockElement, HTMLElement, MediaAtomElement } from 'src/common'
import { metrics } from 'src/theme/spacing'
import { color } from 'src/theme/color'
import { generateAssetsFontCss, css, makeHtml } from '../../../helpers/webview'
import { PixelRatio } from 'react-native'

const styles = css`
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
        color: ${color.primary};
        text-decoration-color: ${color.line};
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
        <iframe scrolling="no" src="https://embed.theguardian.com/embed/atom/media/${mediaAtomElement.atomId}" style="width: 100%; display: block;" frameborder="0"></iframe>
        <figcaption>${mediaAtomElement.title}</figcaption>
    </figure>`
}

export const render = (article: BlockElement[]) => {
    const html = article
        .filter(el => el.id === 'html' || el.id === 'media-atom')
        .map(el => {
            switch (el.id) {
                case 'html':
                    return (el as HTMLElement).html
                case 'media-atom':
                    return renderMediaAtom(el as MediaAtomElement)
                default:
                    ''
            }
        })
        .join('')

    return makeHtml({ styles, html })
}
