import { html } from 'src/helpers/webview'
import { HeaderType, ArticleType } from 'src/common'
import { ArticleHeaderProps } from './header'
import { Quotes } from './icon/quotes'

const getHeadline = (
    articleHeaderType: HeaderType,
    articleType: ArticleType,
    headerProps: ArticleHeaderProps,
) => {
    if (
        articleHeaderType === HeaderType.LargeByline ||
        articleType === ArticleType.Interview
    ) {
        return html`
            <h1>
                <span class="header-top-headline"
                    >${(articleType === ArticleType.Opinion ||
                        articleType === ArticleType.Interview) &&
                        Quotes()}${headerProps.headline}
                </span>
                ${articleType !== ArticleType.Interview &&
                    html`
                        <span class="header-top-byline"
                            >${headerProps.bylineHtml}
                        </span>
                    `}
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
