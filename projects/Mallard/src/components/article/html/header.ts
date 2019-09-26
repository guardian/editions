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
    .header img {
        height: 56vw !important;
        width: 100% !important;
        object-fit: cover;
        display: block;
    }
    .header span {
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
        border-bottom: 1px solid ${color.dimLine};
    }

    /*review*/
    .header-container[data-type='review'] {
        background-color: ${colors.faded};
        margin: 0 -50em;
        padding: 0 50em;
    }
    .header-container[data-type='review'] h1 {
        color: ${colors.dark};
        ${getScaledFontCss('headline', 1.5)}
        font-weight: 600;
    }
    .header-container[data-type='review'] .header-byline {
        color: ${colors.dark};
    }
    .header-container[data-type='review'] p {
        color: ${colors.main};
    }
`

const Image = ({
    image,
    publishedId,
}: {
    publishedId: Issue['publishedId']
    image: ImageT
}) => {
    const backend = defaultSettings.apiUrl
    const path = `${backend}${mediaPath(
        publishedId,
        imageForScreenSize(),
        image.source,
        image.path,
    )}`
    return html`
        <img src="${path}" style="width:100%;" />
    `
}

const Header = ({
    publishedId,
    type,
    ...headerProps
}: {
    publishedId: Issue['publishedId'] | null
    type: ArticleType
} & ArticleHeaderProps) => {
    return html`
        <div class="header-container" data-type="${type}">
            <header class="header">
                ${headerProps.image &&
                    publishedId &&
                    Image({ image: headerProps.image, publishedId })}
                <span>${headerProps.kicker}</span>
                <section class="header-top">
                    <h1>${headerProps.headline}</h1>
                    <p>${headerProps.standfirst}</p>
                </section>
            </header>

            <aside class="header-byline">
                <span>${headerProps.byline}</span>
            </aside>
        </div>
    `
}

export { Header }
