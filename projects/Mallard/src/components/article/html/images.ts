import { ImageElement } from 'src/common'
import { html, css, getScaledFontCss, px } from 'src/helpers/webview'
import { imagePath } from 'src/paths'
import { PixelRatio } from 'react-native'
import { color } from 'src/theme/color'
import { CssProps } from './helpers/props'
import { breakOut } from './helpers/layout'

const imageStyles = ({ colors, wrapLayout }: CssProps) => css`
    .image {
        position: relative;
        background: blue;
    }
    .image img {
        display: block;
        width: 100%;
        height: auto;
    }
    .image figcaption {
        padding-top: 0.5em;
        font-family: 'GuardianTextSans-Regular';
        ${getScaledFontCss('sans', 0.5)}
        color: ${color.palette.neutral[60]};
    }
    .image {
    }
    .image figcaption {
        position: absolute;
        right: ${px(breakOut(wrapLayout) * -1)};
        top: -.2em;
        padding: 0;
        width: ${px(wrapLayout.rail.contentWidth)}
    }
`

type ImageRoles = 'supporting' | 'immersive' | 'showcase' | string

const ImageBase = ({
    path,
    alt,
    caption,
    credit,
    role,
}: {
    path: string
    alt?: string
    caption?: string
    credit?: string
    role?: ImageRoles
}) => {
    return html`
        <figure class="image" data-role="${role}">
            <img
                src="${path}"
                style="display: block; width: 100%; height: auto;"
                alt="${alt}"
            />
            ${(caption || credit) &&
                html`
                    <figcaption>
                        ${caption} ${credit}
                    </figcaption>
                `}
        </figure>
    `
}

const Image = ({ imageElement }: { imageElement: ImageElement }) => {
    const path = imagePath(imageElement.src)
    return ImageBase({ path, ...imageElement })
}

export { Image, imageStyles }
