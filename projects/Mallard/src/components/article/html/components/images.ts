import { ImageElement } from 'src/common'
import { Direction } from 'src/common'
import { css, getScaledFontCss, html, px } from 'src/helpers/webview'
import { Breakpoints } from 'src/theme/breakpoints'
import { metrics } from 'src/theme/spacing'
import { Arrow } from './arrow'
import { CssProps, themeColors } from '../helpers/css'

export const renderCaption = ({
    caption,
    credit,
}: Pick<ImageElement, 'caption' | 'credit'>) =>
    [caption, credit].filter(s => !!s).join(' ')

const breakoutCaption = (role: ImageElement['role']) => css`
    .image[data-role='${role}'] figcaption {
        position: absolute;
        right: ${px(
            (metrics.article.rightRail + metrics.article.sides * 1.5) * -1,
        )};
        top: -0.5em;
        display: block;
        width: ${px(metrics.article.rightRail)};
    }

    .image[data-role='${role}'] figcaption svg {
        transform: rotate(-90deg);
    }
`

const imageStyles = ({ colors, theme }: CssProps) => css`
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
        color: ${themeColors(theme).dimText};
        ${getScaledFontCss('sans', 0.5)}
        padding: 0 0 0 1em;
        position: relative;
        margin-top: 0.5em;
    }
    .image figcaption svg {
        width: 0.8em;
        left: 0;
        top: 0.3em;
        position: absolute;
        right: ${px(
            (metrics.article.rightRail + metrics.article.sides * 1.5) * -1,
        )};
    }
    .image figcaption svg path {
        fill: ${colors.main};
    }

    /*INLINE*/
    @media (min-width: ${px(Breakpoints.tabletVertical)}) {
        ${breakoutCaption('inline')}
    }

    /*THUMBS*/
    @media (max-width: ${px(Breakpoints.tabletVertical)}) {
        .image[data-role='thumbnail'] {
            width: 40%;
            float: left;
            margin-right: ${px(metrics.article.sides)};
        }
    }
    @media (min-width: ${px(Breakpoints.tabletVertical)}) {
        .image[data-role='thumbnail'] {
            width: ${px(metrics.article.rightRail)};
            position: absolute;
            right: 0;
        }
    }

    /*SUPPORTING*/
    @media (min-width: ${px(Breakpoints.tabletVertical)}) {
        .image[data-role='supporting'] {
            float: right;
            width: 500px;
            margin-left: ${px(metrics.article.sides)};
            margin-right: ${px(
                (metrics.article.rightRail + metrics.article.sides) * -1,
            )};
        }

        .image[data-role='supporting'] figcaption {
            width: ${px(metrics.article.rightRail - metrics.article.sides)};
            position: absolute;
            right: 0;
        }
    }

    /*SHOWCASE*/
    @media (min-width: ${px(Breakpoints.tabletVertical)}) and (max-width: ${px(
            Breakpoints.tabletLandscape,
        )}) {
        .image[data-role='showcase'] {
            margin-right: ${px(
                (metrics.article.rightRail + metrics.article.sides) * -1,
            )};
        }

        .image[data-role='showcase'] figcaption {
            width: ${px(metrics.article.rightRail)};
            float: right;
        }
    }
    @media (min-width: ${px(Breakpoints.tabletLandscape)}) {
        .image[data-role='showcase'] img {
            margin-left: ${px(
                ((Breakpoints.tabletLandscape - metrics.article.maxWidth) / 2) *
                    -1,
            )};
            width: calc(
                100% +
                    ${px(
                        (Breakpoints.tabletLandscape -
                            metrics.article.maxWidth) /
                            2,
                    )}
            );
        }
        ${breakoutCaption('showcase')}
    }

    /*IMMERSIVE*/
    @media (min-width: ${px(Breakpoints.tabletVertical)}) {
        .image[data-role='immersive'] {
            margin-right: ${px(
                (metrics.article.rightRail + metrics.article.sides) * -1,
            )};
        }
        .image[data-role='immersive'] figcaption {
            width: ${px(metrics.article.rightRail)};
            float: right;
        }
    }
    @media (min-width: ${px(Breakpoints.tabletLandscape)}) {
        .image[data-role='immersive'] img {
            width: calc(
                100% +
                    ${px(
                        Breakpoints.tabletLandscape - metrics.article.maxWidth,
                    )}
            );
            display: block;
            background: 'red';
            margin-left: ${px(
                ((Breakpoints.tabletLandscape - metrics.article.maxWidth) / 2) *
                    -1,
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
    path,
}: {
    imageElement: ImageElement
    path: string | undefined
}) => {
    if (path) {
        return ImageBase({ path, ...imageElement })
    }
    return null
}

export { Image, imageStyles }
