import { ImageElement } from 'src/common'
import { html, css, getScaledFontCss } from 'src/helpers/webview'
import { imagePath } from 'src/paths'
import { PixelRatio } from 'react-native'
import { color } from 'src/theme/color'

const imageStyles = css`
    .image {
        overflow: hidden;
    }
    .image img {
        display: block;
        width: 100%;
        height: auto;
    }
    .image-showcase {
    }
    figcaption {
        padding-top: 0.5em;
        font-family: 'GuardianTextSans-Regular';
        ${getScaledFontCss('sans', 0.5)}
        color: ${color.palette.neutral[60]};
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
