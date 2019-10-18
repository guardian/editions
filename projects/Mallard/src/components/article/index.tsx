import React from 'react'
import { ScrollView } from 'react-native'
import { CAPIArticle } from 'src/common'
import { FlexErrorMessage } from 'src/components/layout/ui/errors/flex-error-message'
import {
    OnTopPositionChangeFn,
    wireScrollBarToDismiss,
} from 'src/screens/article/helpers'
import { color } from 'src/theme/color'
import { Article, ArticleTheme } from './types/article'
import { Crossword } from './types/crossword'
import { Gallery } from './types/gallery'
import { ErrorBoundary } from '../layout/ui/errors/error-boundary'

/*
This is the article view! For all of the articles.
it gets everything it needs from its route
*/

const ArticleController = ({
    article,
    onTopPositionChange,
}: {
    article: CAPIArticle
    onTopPositionChange: OnTopPositionChangeFn
}) => {
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
            <Article
                onTopPositionChange={onTopPositionChange}
                article={article}
            />
        </ErrorBoundary>
    )
}

export { ArticleController }
