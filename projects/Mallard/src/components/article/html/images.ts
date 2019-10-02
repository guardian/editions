import { ImageElement, mediaPath } from 'src/common'
import { backends, defaultSettings } from 'src/helpers/settings/defaults'
import { Direction } from 'src/helpers/sizes'
import { css, getScaledFontCss, html, px } from 'src/helpers/webview'
import { Breakpoints } from 'src/theme/breakpoints'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { Arrow } from './arrow'
import { breakOut } from './helpers/layout'
import { CssProps } from './helpers/props'
import { imageForScreenSize } from 'src/helpers/screen'

export const renderCaption = ({
    caption,
    credit,
}: Pick<ImageElement, 'caption' | 'credit'>) =>
    [caption, credit].filter(s => !!s).join(' ')

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
        z-index: 10000;
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
            right: ${px(metrics.article.sides * 0.5)};
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
            position: absolute;
            right: 0;
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
    const figcaption = renderCaption({ caption, credit })
    return html`
        <figure class="image" data-role="${role || 'inline'}">
            <img src="${path}" alt="${alt}" />
            ${figcaption &&
                html`
                    <figcaption>
                        ${Arrow({ direction: Direction.top })} ${figcaption}
                    </figcaption>
                `}
        </figure>
    `
}

const Image = ({
    imageElement,
    publishedId,
}: {
    imageElement: ImageElement
    publishedId: string
}) => {
    // @TODO: This needs refactoring to work with downloaded content
    const backend = defaultSettings.apiUrl
    const path = `${backend}${mediaPath(
        publishedId,
        imageForScreenSize(),
        imageElement.src.source,
        imageElement.src.path,
    )}`

    return ImageBase({ path, ...imageElement })
}

export { Image, imageStyles }
