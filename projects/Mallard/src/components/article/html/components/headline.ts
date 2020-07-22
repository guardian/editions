import { html } from 'src/helpers/webview'
import { HeaderType, ArticleType } from 'src/common'
import { ArticleHeaderProps } from './header'
import { Quotes } from './icon/quotes'

const getHeadline = (
    articleHeaderType: HeaderType,
    articleType: ArticleType,
    headerProps: ArticleHeaderProps,
) => {
    if (articleHeaderType === HeaderType.LargeByline) {
        return html`
            <h1>
                ${articleType === ArticleType.Opinion && Quotes()}
                <span class="header-top-headline"
                    >${headerProps.headline}
                </span>
                <span class="header-top-byline"
                    >${headerProps.bylineHtml}
                </span>
            </h1>
        `
    } else {
        return html`
            <h1>
                ${headerProps.headline}
            </h1>
        `
    }
}

export { getHeadline }
