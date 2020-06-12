import { ArticleType, HeaderType, Image as ImageT, Issue } from 'src/common'
import { css, html, px } from 'src/helpers/webview'
import { GetImagePath } from 'src/hooks/use-image-paths'
import { Breakpoints } from 'src/theme/breakpoints'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { families } from 'src/theme/typography'
import {
    CreditedImage,
    Article,
    MediaAtomElement,
} from '../../../../../../Apps/common/src'
import { CssProps, themeColors } from '../helpers/css'
import { breakSides } from '../helpers/layout'
import { Quotes } from './icon/quotes'
import { Line } from './line'
import { Rating } from './rating'
import { SportScore } from './sport-score'
import { renderMediaAtom } from './media-atoms'
import { Platform } from 'react-native'

export interface ArticleHeaderProps {
    headline: string
    byline?: string
    kicker?: string | null
    image?: CreditedImage | null
    standfirst?: string
    starRating?: Article['starRating']
    sportScore?: Article['sportScore']
    bylineImages?: { cutout?: ImageT }
    bylineHtml?: string
    mainMedia?: MediaAtomElement
}

const outieKicker = (type: ArticleType) => css`
    .header-container[data-type='${type}'] .header-kicker {
        display: inline-block;
        height: 3em;
        margin-top: -3em;
        padding-right: ${metrics.article.sides};
        margin-left: -10em;
        padding-left: 10em;
        border: none;
        z-index: 9;
    }
    .header-container[data-type='${type}'] .header {
        position: relative;
        z-index: 9;
    }
`

const outieHeader = (type: ArticleType) => css`
    .header-container[data-type='${type}'] .header {
        ${breakSides}
        margin-top: -4em;
        padding-top: 0;
        margin-left: -50em;
        padding-left: 50em;
    }
    .header-container[data-type='${type}'] {
        padding-top: 1px;
    }
    @media (max-width: ${px(Breakpoints.tabletVertical)}) {
        .header-container[data-type='${type}'] .header {
            margin-right: 60px;
        }
        .header-container[data-type='${type}'] .header:after {
            margin-right: ${px((60 + metrics.article.sides) * -1)};
        }
    }
    ${outieKicker(type)}
`

const shareButtonColor = ({ colors, theme }: CssProps) => {
    return theme === 'dark' ? color.palette.neutral[100] : colors.main
}

export const headerStyles = ({ colors, theme }: CssProps) => css`

    /* prevent clicks on byline links */
    .header a {
        pointer-events: none;
    }

    .header:after, .header-immersive-video:after {
        background-image: repeating-linear-gradient(
            to bottom,
            ${color.dimLine},
            ${color.dimLine} 1px,
            transparent 1px,
            transparent 4px
        );
        background-repeat: repeat-x;
        background-position: bottom;
        background-size: 1px 16px;
        content: '';
        display: block;
        height: 16px;
        margin: 0;
    }
    @media (min-width: ${px(Breakpoints.tabletVertical)}) {
        .header:after, .header-immersive-video:after {
            margin-right: ${px(metrics.article.sides * -1)};
        }
    }
    .header {
        padding-top: ${px(metrics.vertical / 2)};
    }
    .header-container-line-wrap,
    .header-container {
        position: relative;
        -webkit-user-select: none;
        -webkit-user-drag: none;
    }
    .header-container-line-wrap {
        ${breakSides}
        z-index: 100;
        max-width: ${px(metrics.article.maxWidth + metrics.article.sides * 2)};
        margin: auto;
    }
    .header-bg {
        left: -50em;
        right: -50em;
        top: 0;
        bottom: 0;
        position: absolute;
        z-index: -1;
    }
    .header-image--wide {
        max-width: ${px(metrics.article.maxWidth)};
        margin: auto;
    }

    .header-image > .rating, .sport-score {
        position: absolute;
        bottom:0;
        left:0;
    }
    .header-image--immersive {
        height: 65%;
        width: 100%;
        object-fit: cover;
        display: block;
        z-index: 99;
        position: relative;
        margin: 0 ${px(metrics.article.sides * -1)};
        width: calc(100% + ${px(metrics.article.sides * 2)});
        padding-top: 100%;
    }
    @media (max-width: ${px(Breakpoints.tabletVertical)}) {
        header-image--immersive {
            padding-top: 140%;
        }
    }

    .header-kicker {
        font-family: ${families.titlepiece.regular};
        font-size: 16px;
        line-height: 1;
        color: ${colors.main};
        padding: 0.25em 0 0.8em;
        border-bottom: 1px solid ${color.dimLine};
        display: block;
    }
    .header h1, .header-immersive-video h1 {
        font-size: 30px;
        font-family: ${families.headline.regular};
        font-weight: 400;
        line-height: 1.125em;
        margin: 0.1em 1em 0.75em 0;
        word-wrap: none;
    }

    @media (min-width: ${px(Breakpoints.tabletVertical)}) {
        .header h1 {
            font-size: 40px;
        }
    }

    .header h1 svg {
        height: .7em;
        transform: scale(1.1);
        width: auto;
        fill: ${colors.main};
    }

    .header-standfirst-color {
        font-weight: 600;
        color: ${colors.main};
    }

    .header-standfirst { 
        font-weight: 600; 
        color: ${color.palette.neutral[46]};
    }

    .header-byline {
        font-size: 16px;
        line-height: 1.25em;
        margin: 0;
    }

    .header-byline-italic {
        font-style: italic;
    }

    .header-byline:not(:empty) {
        padding: 0.25em 0 1.5em;
        position: relative;
    }

    .header-byline > span > a {
        font-style: normal !important;
        text-decoration: none;
        font-weight: 600;
        color: ${colors.main};
    }

    .header-top-byline > a {
        font-style: normal !important;
        text-decoration: none;
    }

    .header-byline:not(:empty):after {
        content: '';
        display: block;
        height: 1px;
        background-color: ${color.dimLine};
        position: absolute;
        bottom: -1px;
        left: ${px(metrics.article.sides * -1)};
        right: ${px(metrics.article.sides * -1)};
    }
    @media (min-width: ${px(Breakpoints.tabletVertical)}) {
        .header-byline:not(:empty):after {
            left: 0;
        }
    }

    .header-top p, .header-immersive-video p {
        font-family: ${families.headline.medium};
        letter-spacing: 0.2px;
        line-height: 1.1875em;
        margin-bottom: 0.875em;
        font-size: 18px;
    }
    @media (min-width: ${px(Breakpoints.tabletVertical)}) {
        .header-top p, .header-immersive-video p {
            font-size: 18px;
        }
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
    }

    .header-opinion-flex > :first-child {
        flex: 1 1 0;
    }

    .header-opinion-flex > :last-child {
        width: 15%;
        overflow: visible;
        flex: 0 0 auto;
    }

    .header-opinion-flex > :last-child img {
        width: 240%;
        display: block;
        float: right;
    }

    .image-as-bg {
        display: block;
        padding-top: 60%;
        background-size: cover;
        background-position: center;
        position: relative;
    }

    .image-as-bg[data-preserve-ratio=true] {
        padding-top:0;
        overflow: visible;
        height: auto;
    }

    .image-as-bg__img {
        width: 100%;
        z-index: 0;
        position: relative;
    }

    .image-as-bg-info {
        position: absolute;
        top:0;
        left:0;
        bottom:0;
        right:0;
        padding: ${px(metrics.vertical)} ${px(metrics.horizontal)};
        color: ${color.palette.neutral[100]};
        background: rgba(20,20,20,.8);
        font-family: ${families.sans.regular};
        z-index: 1;
        display:none;
    }

    .image-as-bg[data-open=true] .image-as-bg-info {
        display:block;
    }

    .image-as-bg > button {
        position: absolute;
        bottom: ${px(metrics.vertical)};
        right: ${px(metrics.horizontal)};
        z-index: 2;
        font-family: ${families.icon.regular};
        background-color: ${colors.main};
        color: ${color.textOverDarkBackground};
        border:none;
        width: ${metrics.fronts.circleButtonDiameter}px;
        height: ${metrics.fronts.circleButtonDiameter}px;
        display: block;
        line-height: .9;
        text-align: center;
        font-size: 1.2em;
        border-radius: 100%;
    }

    button:focus {
        outline: 0;
        outline-style:none;
        outline-width:0;
    }

    .share-touch-zone {
        float: right;
        margin: -8px -8px 0 0;
        padding: 8px;
        background: none;
        border: none;
        font-family: ${families.icon.regular};
        font-size: 1.2em;
    }
    .share-button {
        display: flex;
        width:  ${metrics.fronts.circleButtonDiameter}px;
        height: ${metrics.fronts.circleButtonDiameter}px;
        border: 1px solid ${shareButtonColor({ theme, colors })};;
        color: ${shareButtonColor({ theme, colors })};
        border-radius: 100%;
        align-items: center;
        justify-content: center;
    }
    .share-icon {
        padding-bottom: .1em;
        color: ${shareButtonColor({ theme, colors })};
    }

    .clearfix {
        clear: both;
    }

    /*review*/
    .header-container[data-type='review']:after {
        border-bottom: 1px solid ${color.dimLine};
    }
    .header-container[data-type='review'] .header-bg {
        background-color: ${colors.faded};
    }
    .header-image[data-type='review'] .header-bg {
        background-color: ${colors.faded};
    }
    .header-container[data-type='review'] h1 {
        color: ${colors.dark};
        font-family: ${families.headline.bold};
    }
    .header-container[data-type='review'] .header-kicker {
        color: ${colors.dark};
    }
    .header-container[data-type='review'] .header-byline a {
        color: ${colors.dark};
    }
    .header-container[data-type='review'] p {
        color: ${colors.dark};
    }

    /*opinion*/
    .header-container[data-type='opinion']:after {
        border-bottom: 1px solid ${color.dimLine};
    }
    .header-container[data-type='opinion'] .header-bg {
        background-color: ${color.palette.opinion.faded};
    }
    .header-image[data-type='opinion'] .header-bg {
        background-color: ${color.palette.opinion.faded};
    }
    .header-container[data-type='opinion'] .header-kicker {
        display: none;
    }
    .header-container[data-type='opinion'] .header-byline {
        color: ${color.palette.neutral[46]};
    }
    .header-container[data-type='opinion'] h1 {
        font-family: ${families.headline.light};
    }
    .header-container[data-type='opinion'] h1 .header-top-byline {
        color: ${colors.main};
        display: block;
        font-family: ${families.titlepiece.regular};
    }


    /*analysis*/
    .header-container[data-type='analysis']:after {
        border-bottom: 1px solid ${color.dimLine};
    }
    .header-container[data-type='analysis'] .header-bg {
        background-color: ${color.palette.neutral[93]};
    }
    .header-image[data-type='analysis'] .header-bg {
        background-color: ${color.palette.neutral[93]};
    }
    .header-container[data-type='analysis'] .header-kicker {
        display: none;
    }
    .header-container[data-type='analysis'] .header-byline {
        color: ${color.palette.neutral[46]};
    }
    .header-container[data-type='analysis'] h1 {
        font-family: ${families.headline.light};
    }
    .header-container[data-type='analysis'] h1 .header-top-headline {
        text-decoration: underline;
        text-decoration-color: ${colors.main};
        text-decoration-thickness: 1px;
    }
    .header-container[data-type='analysis'] h1 .header-top-byline {
        display: block;
        font-family: ${families.headline.regular};
        font-style: italic;
    }
    .header-container[data-type='analysis'] h1 .header-top-byline > a {
        font-family: ${families.titlepiece.regular};
        font-style: normal;
    }

    /*gallery*/
    .header-container[data-type='${
        ArticleType.Gallery
    }'] .header-byline  > span > a {
        color: ${themeColors(theme).text};
    }
    .header-container[data-type='${ArticleType.Gallery}'] h1 {
        font-family: ${families.titlepiece.regular};
        min-height: 2em;
    }

    /*immersive*/
    ${outieHeader(ArticleType.Immersive)}
    .header-container[data-type='immersive'] .header-bg {
        background-color: ${color.palette.neutral[100]};
    }
    .header-image[data-type='immersive'] .header-bg {
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
        color: ${colors.dark};
    }
    .header-container[data-type='immersive'] .header-byline a {
        color: ${colors.dark};
    }

    /*longread*/
    ${outieHeader(ArticleType.Longread)}
    .header-container[data-type='${ArticleType.Longread}'] {
        color: ${color.textOverDarkBackground};
    }
    .header-container[data-type='${ArticleType.Longread}'] .header-bg {
        background-color: ${color.palette.neutral[7]};
    }
    .header-image[data-type='${ArticleType.Longread}'] .header-bg {
        background-color: ${color.palette.neutral[7]};
    }
    .header-container[data-type='${ArticleType.Longread}'] .header {
        background-color: ${color.palette.neutral[7]};
    }
    .header-container[data-type='${ArticleType.Longread}'] .header-kicker {
        background-color: ${colors.main};
        color: ${color.textOverDarkBackground};
        font-family: ${families.headline.bold};
    }
    .header-container[data-type='${ArticleType.Longread}'] .header-top h1 {
        font-family: ${families.titlepiece.regular};
    }
    .header-container[data-type='${ArticleType.Longread}'] .header-byline,
    ${'' /* this is needed to be more specific than an above style */}
    .header-container[data-type='${ArticleType.Longread}'] .header-byline a {
        color: ${color.textOverDarkBackground};
    }

    /*obit*/
    ${outieKicker(ArticleType.Obituary)}
    .header-container[data-type='${ArticleType.Obituary}'] {
        color: ${color.textOverDarkBackground};
    }
    .header-container[data-type='${ArticleType.Obituary}'] .header-bg {
        background-color: ${color.palette.neutral[20]};
    }
    .header-image[data-type='${ArticleType.Obituary}'] .header-bg {
        background-color: ${color.palette.neutral[20]};
    }
    .header-container[data-type='${ArticleType.Obituary}'] .header {
        background-color: ${color.palette.neutral[20]};
    }
    .header-container[data-type='${ArticleType.Obituary}'] .header-kicker {
        background-color: ${color.palette.neutral[20]};
        color: ${color.textOverDarkBackground};
        font-family: ${families.headline.bold};
    }
    .header-container[data-type='${ArticleType.Obituary}'] .header-top h1 {
        font-family: ${families.titlepiece.regular};
    }
    .header-container[data-type='${ArticleType.Obituary}'] .header-byline,
    ${'' /* this is needed to be more specific than an above style */}
    .header-container[data-type='${ArticleType.Obituary}'] .header-byline a {
        color: ${color.textOverDarkBackground};
    }
    .header-container[data-type='${ArticleType.Obituary}'] .share-icon {
        color: ${color.textOverDarkBackground};
    }
    .header-container[data-type='${ArticleType.Obituary}'] .share-button {
        border: 1px solid ${color.textOverDarkBackground};
    }
`

const Image = ({
    image,
    className,
    getImagePath,
}: {
    image: ImageT
    className?: string
    getImagePath: GetImagePath
}) => {
    const path = getImagePath(image)
    return html`
        <img class="${className}" src="${path}" />
    `
}

const MainMediaImage = ({
    image,
    articleType,
    isGallery,
    className,
    children,
    preserveRatio,
    getImagePath,
}: {
    image: CreditedImage
    className?: string
    articleType?: ArticleType
    isGallery?: boolean
    children?: string
    preserveRatio?: boolean
    getImagePath: GetImagePath
}) => {
    const path = getImagePath(image)
    return html`
        <div class="header-image" data-type="${articleType}">
            <div
                class="image-as-bg ${className}"
                data-preserve-ratio="${preserveRatio || 'false'}"
                style="background-image: url(${path}); "
                ${!isGallery &&
                    `onclick="window.ReactNativeWebView.postMessage(JSON.stringify({type: 'openLightbox', index: ${0}, isMainImage: 'true'}))"`}
                data-open="false"
            >
                ${preserveRatio &&
                    html`
                        <img
                            class="image-as-bg__img"
                            src="${path}"
                            aria-hidden
                        />
                    `}
                <button
                    aria-hidden
                    onclick="event.stopPropagation(); this.parentNode.dataset.open = !JSON.parse(this.parentNode.dataset.open)"
                >
                    
                </button>
                <div class="image-as-bg-info">
                    ${image.caption} ${!image.displayCredit ? '' : image.credit}
                </div>
                ${children}
                <div class="header-bg"></div>
            </div>
        </div>
    `
}

const isImmersive = (type: ArticleType) =>
    type === ArticleType.Immersive ||
    type === ArticleType.Longread ||
    type === ArticleType.Obituary ||
    type === ArticleType.Gallery

const getStandFirst = (
    articleHeaderType: HeaderType,
    type: ArticleType,
    headerProps: ArticleHeaderProps,
    publishedId: Issue['publishedId'] | null,
    getImagePath: GetImagePath,
): string => {
    const cutout =
        type === ArticleType.Opinion &&
        headerProps.bylineImages &&
        headerProps.bylineImages.cutout
    if (articleHeaderType === HeaderType.LargeByline) {
        return html`
            <section class="header-top">
                <div class="${cutout && `header-opinion-flex`}">
                    <h1>
                        ${type === ArticleType.Opinion && Quotes()}
                        <span class="header-top-headline"
                            >${headerProps.headline}
                        </span>
                        <span class="header-top-byline"
                            >${headerProps.bylineHtml}
                        </span>
                    </h1>
                    ${publishedId &&
                        cutout &&
                        html`
                            <div>
                                ${Image({
                                    image: cutout,
                                    getImagePath,
                                })}
                            </div>
                        `}
                </div>
            </section>
        `
    } else {
        return html`
            <section class="header-top">
                <h1>
                    ${headerProps.headline}
                </h1>
                ${articleHeaderType === HeaderType.RegularByline &&
                    headerProps.standfirst &&
                    `<p>
                        ${headerProps.standfirst}
                      </p>`}
            </section>
        `
    }
}

const getHeaderClassForType = (headerType: HeaderType): string => {
    switch (headerType) {
        case HeaderType.NoByline:
            return html`
                header-byline header-standfirst
            `
        case HeaderType.LargeByline:
            return html`
                header-byline header-standfirst-color
            `
        case HeaderType.RegularByline:
            return html`
                header-byline header-byline-italic
            `
    }
}

const getByLineText = (
    headerType: HeaderType,
    headerProps: ArticleHeaderProps,
): string | undefined => {
    const byLineText =
        headerType === HeaderType.NoByline ||
        headerType === HeaderType.LargeByline
            ? headerProps.standfirst
            : headerProps.bylineHtml
    return byLineText
}

const hasByLine = (
    byLineText: string | undefined,
    canBeShared: boolean,
): boolean => {
    if (byLineText || canBeShared) {
        return true
    }
    return false
}

const getByLine = (
    headerType: HeaderType,
    canBeShared: boolean,
    headerProps: ArticleHeaderProps,
): string => {
    const headerClass = getHeaderClassForType(headerType)
    const bylineText = getByLineText(headerType, headerProps)
    const shareButton = !canBeShared
        ? ''
        : html`
              <button
                  name="Share button"
                  class="share-touch-zone"
                  onclick="window.ReactNativeWebView.postMessage(JSON.stringify({type: 'share'}))"
              >
                  <div class="share-button">
                      <div class="share-icon">
                          ${Platform.OS === 'ios' ? '\uE009' : '\uE008'}
                      </div>
                  </div>
              </button>
          `
    return html`
        <aside class="${headerClass}">
            ${shareButton}
            <span style="pointer-events: none">${bylineText}</span>
            <div class="clearfix"></div>
        </aside>
    `
}

const Header = ({
    publishedId,
    type,
    headerType,
    getImagePath,
    ...headerProps
}: {
    showMedia: boolean
    publishedId: Issue['publishedId'] | null
    type: ArticleType
    headerType: HeaderType
    canBeShared: boolean
    getImagePath: GetImagePath
} & ArticleHeaderProps) => {
    const immersive = isImmersive(type)
    const isGallery = type === ArticleType.Gallery
    const byLineText = getByLineText(headerType, headerProps)
    const displayWideImage =
        type === ArticleType.Article || type === ArticleType.Review
    return html`
        ${immersive &&
            headerProps.image &&
            publishedId &&
            MainMediaImage({
                image: headerProps.image,
                isGallery: isGallery,
                className: 'header-image--immersive',
                getImagePath,
            })}
        ${!immersive &&
            displayWideImage &&
            headerProps.image &&
            publishedId &&
            MainMediaImage({
                articleType: type,
                className: 'header-image--wide',
                image: headerProps.image,
                isGallery: isGallery,
                preserveRatio: true,
                children: headerProps.starRating
                    ? Rating(headerProps)
                    : headerProps.sportScore
                    ? SportScore({
                          sportScore: headerProps.sportScore,
                      })
                    : undefined,
                getImagePath,
            })}
        <div class="header-container-line-wrap">
            ${Line({ zIndex: 10 })}
            <div class="header-container wrapper" data-type="${type}">
                ${!immersive &&
                    !displayWideImage &&
                    headerProps.image &&
                    publishedId &&
                    MainMediaImage({
                        articleType: type,
                        className: 'header-image--standard',
                        image: headerProps.image,
                        isGallery: isGallery,
                        preserveRatio: true,
                        children: headerProps.starRating
                            ? Rating(headerProps)
                            : headerProps.sportScore
                            ? SportScore({
                                  sportScore: headerProps.sportScore,
                              })
                            : undefined,
                        getImagePath,
                    })}
                <header
                    class=${immersive &&
                    headerProps.mainMedia &&
                    headerProps.showMedia
                        ? 'header-immersive-video'
                        : 'header'}
                >
                    ${headerProps.mainMedia &&
                        (headerProps.showMedia
                            ? renderMediaAtom(headerProps.mainMedia)
                            : null)}
                    ${headerProps.kicker &&
                        html`
                            <span class="header-kicker"
                                >${headerProps.kicker}</span
                            >
                        `}
                    ${getStandFirst(
                        headerType,
                        type,
                        headerProps,
                        publishedId,
                        getImagePath,
                    )}
                </header>
                ${hasByLine(byLineText, headerProps.canBeShared) &&
                    getByLine(
                        headerType,
                        headerProps.canBeShared,
                        headerProps as ArticleHeaderProps,
                    )}
                <div class="header-bg"></div>
            </div>
        </div>
    `
}

export { Header }
