import {
    css,
    generateAssetsFontCss,
    getScaledFont,
    getScaledFontCss,
    px,
} from 'src/helpers/webview'
import { metrics } from 'src/theme/spacing'
import { families } from 'src/theme/typography'
import { headerStyles } from './components/header'
import { imageStyles } from './components/images'
import { lineStyles } from './components/line'
import { quoteStyles } from './components/pull-quote'
import { starRatingStyles } from './components/rating'
import { sportScoreStyles } from './components/sport-score'
import { CssProps, themeColors } from './helpers/css'
import { Breakpoints } from 'src/theme/breakpoints'
import { mediaAtomStyles } from './components/media-atoms'

const makeFontsCss = () => css`
    /* text */
    ${generateAssetsFontCss({ fontFamily: families.text.regular })}
    ${generateAssetsFontCss({
        fontFamily: families.text.bold,
        variant: {
            showsAsFamily: families.text.regular,
            weight: 700,
            style: 'normal',
        },
    })}
    ${generateAssetsFontCss({
        fontFamily: families.text.regularItalic,
        variant: {
            showsAsFamily: families.text.regular,
            weight: 400,
            style: 'italic',
        },
    })}

    /*headline*/
    ${generateAssetsFontCss({ fontFamily: families.headline.regular })}
    ${generateAssetsFontCss({
        fontFamily: families.headline.light,
        variant: {
            showsAsFamily: families.headline.regular,
            weight: 200,
            style: 'normal',
        },
    })}
    ${generateAssetsFontCss({
        fontFamily: families.headline.bold,
        variant: {
            showsAsFamily: families.headline.regular,
            weight: 700,
            style: 'normal',
        },
    })}
    ${generateAssetsFontCss({
        fontFamily: families.headline.medium,
        variant: {
            showsAsFamily: families.headline.regular,
            weight: 500,
            style: 'normal',
        },
    })}

    /* other fonts */
    ${generateAssetsFontCss({ fontFamily: families.sans.regular })}
    ${generateAssetsFontCss({ fontFamily: families.titlepiece.regular })}
    ${generateAssetsFontCss({
        fontFamily: families.icon.regular,
        extension: 'otf',
    })}
`

const makeCss = ({ colors, theme }: CssProps) => css`
    ${makeFontsCss()}

    :root {
        ${getScaledFontCss('text', 1)}
        font-family: ${families.text.regular};
        background-color: ${themeColors(theme).background};
        color: ${themeColors(theme).text};
    }

    html, body {
        overflow-x: hidden;
    }
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    .drop-cap p:first-child:first-letter {
        font-family: 'GHGuardianHeadline-Regular';
        color: ${colors.main};
        float: left;
        font-size: ${px(getScaledFont('text', 1).lineHeight * 4)};
        line-height: ${px(getScaledFont('text', 1).lineHeight * 4)};
        display: inline-block;
        transform: scale(1.335) translateY(1px) translateX(-2px);
        transform-origin: left center;
        margin-right: 25px;
    }

    @keyframes fade {
        from {
            opacity: 0
        }

        to {
            opacity: 1;
        }
    }

    .app {
        padding: 0 ${metrics.article.sides} ${px(metrics.vertical)};
        max-width: ${px(metrics.article.maxWidth + metrics.article.sides * 2)};
        margin: auto;
        position: relative;
        animation-duration: .5s;
        animation-name: fade;
        animation-fill-mode: both;
    }
    @media (min-width: ${px(Breakpoints.tabletVertical)}) {
        main, .wrapper {
            margin-right: ${px(
                metrics.article.rightRail + metrics.article.sides,
            )}
        }
    }
    .app p,
    figure {
        margin-bottom: ${px(metrics.vertical * 2)};
    }
    .app a {
        color: ${colors.main};
        text-decoration-color: ${colors.pastel};
    }
    * {
        margin: 0;
        padding: 0;
    }
    .app p {
      line-height: 1.4;
      margin-bottom: 15px;
    }
    .app h2 {
      font-size: ${px(getScaledFont('headline', 1).lineHeight)};
      line-height: ${px(getScaledFont('headline', 1).lineHeight * 1.1)};
      margin-bottom: ${px(metrics.vertical)};
      margin-top: ${px(metrics.vertical * 2.5)};
    }
    .content-wrap {
        position: relative;
        padding-top: ${px(metrics.vertical)};
    }
    .content-wrap .line {
        margin-right: ${px(metrics.article.sides * -1)};
    }
    ${quoteStyles({
        colors,
        theme,
    })}
    ${headerStyles({
        colors,
        theme,
    })}
    ${imageStyles({ colors, theme })}
    ${lineStyles({ colors, theme })}
    ${starRatingStyles({ colors, theme })}
    ${sportScoreStyles({ colors, theme })}
    ${mediaAtomStyles}
`

export { makeCss }
