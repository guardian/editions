import { html, css, getScaledFontCss, px } from 'src/helpers/webview'
import { ArticleHeaderProps } from '../article-header/types'
import { defaultSettings } from 'src/helpers/settings/defaults'
import { Issue, mediaPath, Image as ImageT, ArticleType } from 'src/common'
import { imageForScreenSize } from 'src/helpers/screen'
import { families } from 'src/theme/typography'
import { color } from 'src/theme/color'
import { PillarColours } from '@guardian/pasteup/palette'
import { WrapLayout } from '../wrap/wrap'
import { metrics } from 'src/theme/spacing'
import { Breakpoints } from 'src/theme/breakpoints'
import { Line } from './line'
import { breakSides } from './helpers/layout'

const outieHeader = (type: ArticleType) => css`
    .header-container[data-type='${type}'] .header {
        ${breakSides}
        margin-top: -4em;
    }
    .header-container[data-type='${type}'] {
        padding-top: 1px;
    }
    @media (max-width: ${px(Breakpoints.tabletVertical)}) {
        .header-container[data-type='${type}'] .header {
            margin-right: 2em;
        }
        .header-container[data-type='${type}'] .header:after {
            margin-right: -4em;
        }
    }
    .header-container[data-type='${type}'] .header-kicker {
        display: inline-block;
        height: 3em;
        margin-top: -3em;
        padding-right: ${metrics.article.sidesTablet};
        margin-left: -10em;
        padding-left: 10em;
        border: none;
    }
`

export const headerStyles = ({
    colors,
    wrapLayout,
}: {
    colors: PillarColours
    wrapLayout: WrapLayout
}) => css`
    .header:after {
        background-image: repeating-linear-gradient(
            to bottom,
            ${color.dimLine},
            ${color.dimLine} 0.0625rem,
            transparent 0.0625rem,
            transparent 0.25rem
        );
        background-repeat: repeat-x;
        background-position: bottom;
        background-size: 0.0625rem 0.8125rem;
        content: '';
        display: block;
        height: 0.8125rem;
        margin: 0 ${px(metrics.article.sidesTablet * -1)};
    }
    .header-container-line-wrap,
    .header-container {
        position: relative;
    }
    .header-container-line-wrap {
        z-index: 100;
        ${breakSides}
    }
    .header-bg {
        left: -50em;
        right: -50em;
        top: 0;
        bottom: 0;
        position: absolute;
        z-index: -1;
    }
    .header-image {
        height: 56vw;
        width: 100%;
        object-fit: cover;
        display: block;
        z-index: 99;
        position: relative;
    }
    .header-image.header-image--immersive {
        margin: 0 ${px(metrics.article.sidesTablet * -1)};
        width: ${px(wrapLayout.width + metrics.article.sidesTablet * 2)};
        height: 100vw;
    }
    .header-kicker {
        font-family: ${families.titlepiece.regular};
        font-size: 0.9em;
        color: ${colors.main};
        padding: 0.25rem 0 1rem;
        border-bottom: 1px solid ${color.dimLine};
        display: block;
    }
    .header h1 {
        ${getScaledFontCss('headline', 1.6)}
        font-weight: 400;
        letter-spacing: -0.5;
        margin: 0.1em 1em 0.75em 0;
    }
    .header-byline {
        font-weight: 600;
        padding: 0.25rem 0 2rem;
        color: ${colors.main};
    }
    .header-container:after {
        content: '';
        display: block;
        height: 0;
        margin: 0 -50em;
    }
    .header-opinion-flex {
        display: flex;
        align-items: flex-end;
        overflow: hidden;
    }

    .header-opinion-flex > :last-child {
        width: 30%;
    }

    .header-opinion-flex > :last-child img {
        width: 250%;
        display: block;
        float: right;
    }

    /*review*/
    .header-container[data-type='review']:after {
        border-bottom: 1px solid ${color.dimLine};
    }
    .header-container[data-type='review'] .header-bg {
        background-color: ${colors.faded};
    }
    .header-container[data-type='review'] h1 {
        color: ${colors.dark};
        ${getScaledFontCss('headline', 1.5)}
        font-family: ${families.headline.bold};
    }
    .header-container[data-type='review'] .header-byline {
        color: ${colors.dark};
    }
    .header-container[data-type='review'] p {
        color: ${colors.main};
    }

    /*opinion*/
    .header-container[data-type='opinion']:after {
        border-bottom: 1px solid ${color.dimLine};
    }
    .header-container[data-type='opinion'] .header-bg {
        background-color: ${color.palette.opinion.faded};
    }
    .header-container[data-type='opinion'] .header-kicker {
        display: none;
    }
    .header-container[data-type='opinion'] .header-byline {
        color: ${color.text};
    }
    .header-container[data-type='opinion'] h1 {
        font-family: ${families.headline.light};
    }
    .header-container[data-type='opinion'] h1 span {
        color: ${colors.main};
        display: block;
        font-family: ${families.titlepiece.regular};
    }

    /*immersive*/
    ${outieHeader(ArticleType.Immersive)}
    .header-container[data-type='immersive'] .header-bg {
        background-color: ${color.palette.neutral[100]};
    }
    .header-container[data-type='immersive'] .header {
        background-color: ${color.palette.neutral[100]};
    }
    .header-container[data-type='immersive'] .header-kicker {
        display: none;
    }
    .header-container[data-type='immersive'] .header-top h1 {
        font-family: ${families.titlepiece.regular};
        color: ${colors.main};
    }

    /*longread*/
    ${outieHeader(ArticleType.Longread)}
    .header-container[data-type='longread'] {
        color: ${color.textOverDarkBackground};
    }
    .header-container[data-type='longread'] .header-bg {
        background-color: ${color.palette.neutral[7]};
    }
    .header-container[data-type='longread'] .header {
        background-color: ${color.palette.neutral[7]};
    }
    .header-container[data-type='longread'] .header-kicker {
        background-color: ${colors.main};
        color: ${color.textOverDarkBackground};
        font-family: ${families.headline.bold};
    }
    .header-container[data-type='longread'] .header-top {
        font-family: ${families.titlepiece.regular};
    }
    .header-container[data-type='longread'] .header-byline {
        color: ${color.textOverDarkBackground};
    }
`

const Image = ({
    image,
    publishedId,
    className,
}: {
    publishedId: Issue['publishedId']
    image: ImageT
    className?: string
}) => {
    const backend = defaultSettings.apiUrl
    const path = `${backend}${mediaPath(
        publishedId,
        imageForScreenSize(),
        image.source,
        image.path,
    )}`
    return html`
        <img class="${className}" src="${path}" />
    `
}

const isImmersive = (type: ArticleType) => type === ArticleType.Immersive
const isOpinion = (type: ArticleType) => type === ArticleType.Opinion

const Header = ({
    publishedId,
    type,
    ...headerProps
}: {
    publishedId: Issue['publishedId'] | null
    type: ArticleType
} & ArticleHeaderProps) => {
    const immersive = isImmersive(type)
    const opinion = isOpinion(type)
    return html`
        ${immersive &&
            headerProps.image &&
            publishedId &&
            Image({
                image: headerProps.image,
                publishedId,
                className: 'header-image header-image--immersive',
            })}
        <div class="header-container-line-wrap">
            ${Line({ zIndex: 10 })}
            <div class="header-container wrapper" data-type="${type}">
                <header class="header">
                    ${!immersive &&
                        headerProps.image &&
                        publishedId &&
                        Image({
                            className: 'header-image',
                            image: headerProps.image,
                            publishedId,
                        })}
                    <span class="header-kicker">${headerProps.kicker}</span>
                    ${!opinion
                        ? html`
                              <section class="header-top">
                                  <h1>
                                      ${headerProps.headline}
                                  </h1>
                                  <p>${headerProps.standfirst}</p>
                              </section>
                          `
                        : html`
                              <section class="header-top">
                                  <div class="header-opinion-flex">
                                      <h1>
                                          ${headerProps.headline}
                                          <span>${headerProps.byline}</span>
                                      </h1>
                                      ${publishedId &&
                                          headerProps.bylineImages &&
                                          headerProps.bylineImages.cutout &&
                                          html`
                                              <div>
                                                  ${Image({
                                                      image:
                                                          headerProps
                                                              .bylineImages
                                                              .cutout,
                                                      publishedId,
                                                  })}
                                              </div>
                                          `}
                                  </div>
                              </section>
                          `}
                </header>

                <aside class="header-byline">
                    <span
                        >${opinion
                            ? headerProps.standfirst
                            : headerProps.byline}</span
                    >
                </aside>
                <div class="header-bg"></div>
            </div>
        </div>
    `
}

export { Header }
