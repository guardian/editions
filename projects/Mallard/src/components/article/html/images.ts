import { ImageElement } from 'src/common'
import { html, css, getScaledFontCss, px } from 'src/helpers/webview'
import { imagePath } from 'src/paths'
import { PixelRatio } from 'react-native'
import { color } from 'src/theme/color'
import { CssProps } from './helpers/props'
import { breakOut } from './helpers/layout'
import { Arrow } from './arrow'
import { Direction } from 'src/helpers/sizes'
import { Breakpoints } from 'src/theme/breakpoints'
import { metrics } from 'src/theme/spacing'

const breakoutCaption = ({
    role,
    wrapLayout,
}: {
    role: ImageElement['role']
    wrapLayout: CssProps['wrapLayout']
}) => css`
    .image[data-role='${role}'] figcaption {
        position: absolute;
        right: ${px(breakOut(wrapLayout) * -1)};
        top: -0.5em;
        display: block;
        width: ${px(wrapLayout.rail.contentWidth)};
    }

    .image[data-role='${role}'] figcaption svg {
        transform: rotate(-90deg);
    }
`

const imageStyles = ({ colors, wrapLayout }: CssProps) => css`
    .image {
        position: relative;
        clear: right;
    }
    .image img {
        display: block;
        width: 100%;
        height: auto;
    }
    .image figcaption {
        font-family: 'GuardianTextSans-Regular';
        color: ${color.palette.neutral[46]};
        ${getScaledFontCss('sans', 0.5)}
        padding: 0 0 0 1em;
        position: relative;
        margin-top: 0.5em;
    }
    .image figcaption svg {
        width: 0.8em;
        left: 0;
        top: 0.35em;
        position: absolute;
        right: ${px(breakOut(wrapLayout) * -1)};
    }
    .image figcaption svg path {
        fill: ${colors.main};
    }

    /*INLINE*/
    @media (min-width: ${px(Breakpoints.tabletVertical)}) {
        ${breakoutCaption({ role: 'inline', wrapLayout })}
    }

    /*THUMBS*/
    @media (max-width: ${px(Breakpoints.tabletVertical)}) {
        .image[data-role='thumbnail'] {
            width: 40%;
            float: left;
            margin-right: ${px(metrics.article.sides * 1.5)};
        }
    }
    @media (min-width: ${px(Breakpoints.tabletVertical)}) {
        .image[data-role='thumbnail'] {
            width: ${px(wrapLayout.rail.contentWidth)};
            position: absolute;
            right: ${px(metrics.article.sides)};
        }
    }

    /*SUPPORTING*/
    @media (min-width: ${px(Breakpoints.tabletVertical)}) {
        .image[data-role='supporting'] {
            float: right;
            width: 500px;
            margin-left: ${px(metrics.article.sides * 1.5)};
            margin-right: ${px(breakOut(wrapLayout) * -1)};
        }

        .image[data-role='supporting'] figcaption {
            width: ${px(wrapLayout.rail.contentWidth)};
            float: right;
        }
    }

    /*SHOWCASE*/
    @media (min-width: ${px(Breakpoints.tabletVertical)}) and (max-width: ${px(
            Breakpoints.tabletLandscape,
        )}) {
        .image[data-role='showcase'] {
            margin-right: ${px(breakOut(wrapLayout) * -1)};
        }

        .image[data-role='showcase'] figcaption {
            width: ${px(wrapLayout.rail.contentWidth)};
            float: right;
        }
    }
    @media (min-width: ${px(Breakpoints.tabletLandscape)}) {
        .image[data-role='showcase'] img {
            margin-left: ${px(
                ((Breakpoints.tabletLandscape - wrapLayout.width) / 2) * -1,
            )};
            width: calc(
                100% +
                    ${px((Breakpoints.tabletLandscape - wrapLayout.width) / 2)}
            );
        }
        ${breakoutCaption({ role: 'showcase', wrapLayout })}
    }

    /*IMMERSIVE*/
    @media (min-width: ${px(Breakpoints.tabletVertical)}) {
        .image[data-role='immersive'] {
            margin-right: ${px(breakOut(wrapLayout) * -1)};
        }
        .image[data-role='immersive'] figcaption {
            width: ${px(wrapLayout.rail.contentWidth)};
            float: right;
        }
    }
    @media (min-width: ${px(Breakpoints.tabletLandscape)}) {
        .image[data-role='immersive'] img {
            width: calc(
                100% + ${px(Breakpoints.tabletLandscape - wrapLayout.width)}
            );
            display: block;
            background: 'red';
            margin-left: ${px(
                ((Breakpoints.tabletLandscape - wrapLayout.width) / 2) * -1,
            )};
        }
    }
`

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
    role?: ImageElement['role']
}) => {
    return html`
        <figure class="image" data-role="${role || 'inline'}">
            <img src="${path}" alt="${alt}" />
            ${(caption || credit) &&
                html`
                    <figcaption>
                        ${Arrow({ direction: Direction.top })} Caption – ${role}
                        – ${caption} ${credit}
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
