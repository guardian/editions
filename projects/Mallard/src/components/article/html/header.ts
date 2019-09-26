import { html, css } from 'src/helpers/webview'
import { ArticleHeaderProps } from '../article-header/types'
import { defaultSettings } from 'src/helpers/settings/defaults'
import { Issue, mediaPath, Image as ImageT } from 'src/common'
import { imageForScreenSize } from 'src/helpers/screen'
import { families } from 'src/theme/typography'

export const headerStyles = css`
    header:after {
        content: '';
        margin: 0 -20px;
        display: block;
        background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PHN2ZyB3aWR0aD0iMXB4IiBoZWlnaHQ9IjEzcHgiIHZpZXdCb3g9IjAgMCAxIDEzIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPiAgICAgICAgPHRpdGxlPlN0YW5kYXJkX2FydGljbGU8L3RpdGxlPiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4gICAgPGRlZnM+PC9kZWZzPiAgICA8ZyBpZD0iQXJ0aWNsZV90ZW1wbGF0ZXMiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPiAgICAgICAgPGcgaWQ9IlN0YW5kYXJkX2FydGljbGUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMS4wMDAwMDAsIC0yNjguMDAwMDAwKSIgZmlsbD0iIzk5OTk5OSI+ICAgICAgICAgICAgPGcgaWQ9ImFydGljbGVfYm9keSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjEuMDAwMDAwLCA5NS4wMDAwMDApIj4gICAgICAgICAgICAgICAgPGcgaWQ9IjQtcnVsZXMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMDAwMDAwLCAxNzMuMDAwMDAwKSI+ICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0icnVsZSIgeD0iMCIgeT0iMCIgd2lkdGg9IjY0OSIgaGVpZ2h0PSIxIj48L3JlY3Q+ICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0icnVsZSIgeD0iMCIgeT0iNCIgd2lkdGg9IjY0OSIgaGVpZ2h0PSIxIj48L3JlY3Q+ICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0icnVsZSIgeD0iMCIgeT0iOCIgd2lkdGg9IjY0OSIgaGVpZ2h0PSIxIj48L3JlY3Q+ICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0icnVsZSIgeD0iMCIgeT0iMTIiIHdpZHRoPSI2NDkiIGhlaWdodD0iMSI+PC9yZWN0PiAgICAgICAgICAgICAgICA8L2c+ICAgICAgICAgICAgPC9nPiAgICAgICAgPC9nPiAgICA8L2c+PC9zdmc+');
        background-repeat: repeat-x;
        background-position-x: 0;
        padding-top: 16px;
    }
    .header img {
        height: 50vw !important;
        width: 100% !important;
        object-fit: cover;
    }
    .header span {
        font-family: ${families.titlepiece.regular};
        font-size: 0.9em;
    }
    .header h1 {
        font-family: ${families.headline.regular};
        font-size: 1.5em;
        line-height: 1.1;
        margin: 0.5em 1em 0.75em 0;
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
            <h1>${headerProps.headline}</h1>
            <p>${headerProps.standfirst}</p>
        </header>
    `
}

export { Header }
