import React from 'react'
import { CAPIArticle, ArticleType } from 'src/common'
import { FlexErrorMessage } from 'src/components/layout/ui/errors/flex-error-message'
import { color } from 'src/theme/color'
import { Article } from './types/article'
import { Crossword } from './types/crossword'
import { Gallery } from './types/gallery'
import { Cartoon } from './types/cartoon'
import { useArticle } from 'src/hooks/use-article'

/*
This is the article view! For all of the articles.
it gets everything it needs from its route
*/

export interface ArticleControllerPropTypes {
    article: CAPIArticle
}

const ArticleController = ({ article }: { article: CAPIArticle }) => {
    const [, { type }] = useArticle()
    switch (article.type) {
        case 'article':
            if (type === ArticleType.Cartoon) {
                return <Cartoon article={article} />
            }
            return <Article article={article.elements} {...article} />

        case 'gallery':
            return <Gallery gallery={article} />

        case 'crossword':
            return <Crossword crosswordArticle={article} />

        case 'picture':
            return (
                <FlexErrorMessage
                    title={'Cartoons are not currently supported.'}
                    style={{ backgroundColor: color.background }}
                />
            )

        default:
            const message: never = article
            return (
                <FlexErrorMessage
                    title={message}
                    style={{ backgroundColor: color.background }}
                />
            )
    }
}

export { ArticleController }
