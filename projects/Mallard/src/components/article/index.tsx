import React from 'react'
import { CAPIArticle } from 'src/common'
import { FlexErrorMessage } from 'src/components/layout/ui/errors/flex-error-message'
import { color } from 'src/theme/color'
import { ErrorBoundary } from '../layout/ui/errors/error-boundary'
import { Article, HeaderControlProps } from './types/article'
import { Crossword } from './types/crossword'

/*
This is the article view! For all of the articles.
it gets everything it needs from its route
*/

const ArticleController = ({
    article,
    ...headerControlProps
}: {
    article: CAPIArticle
} & HeaderControlProps) => {
    if (article.type === 'crossword') {
        return <Crossword crosswordArticle={article} />
    }

    return (
        <ErrorBoundary
            error={
                <FlexErrorMessage
                    title={'Unable to render article'}
                    style={{ backgroundColor: color.background }}
                />
            }
        >
            <Article article={article} {...headerControlProps} />
        </ErrorBoundary>
    )
}

export { ArticleController }
