import { html, css, getScaledFontCss } from 'src/helpers/webview'
import { ArticleHeaderProps } from '../article-header/types'
import { defaultSettings } from 'src/helpers/settings/defaults'
import { Issue, mediaPath, Image as ImageT } from 'src/common'
import { imageForScreenSize } from 'src/helpers/screen'
import { families } from 'src/theme/typography'
import { color } from 'src/theme/color'
import { PillarColours } from '@guardian/pasteup/palette'
import { WrapLayout } from '../wrap/wrap'

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
        background-color: #ffffff;
        content: '';
        display: block;
        height: 0.8125rem;
        margin: 0 -20px;
    }
    .header img {
        height: 56vw !important;
        width: 100% !important;
        object-fit: cover;
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
        letter-spacing: -1;
        margin: 0.1em 1em 0.75em 0;
    }
    .header-byline {
        font-weight: 600;
        padding: 0.25rem 0 1rem;
        color: ${colors.main};
    }
    .header-byline:after {
        content: '';
        display: block;
        height: 0;
        margin: 2rem -20px 0;
        border-bottom: 1px solid ${color.dimLine};
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
    ...headerProps
}: { publishedId: Issue['publishedId'] | null } & ArticleHeaderProps) => {
    return html`
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
    `
}

export { Header }
