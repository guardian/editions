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

/*
This is the article view! For all of the articles.
it gets everything it needs from its route
*/

export interface ArticleControllerPropTypes {
    article: CAPIArticle
}

const ArticleController = ({
    article,
    onTopPositionChange,
}: {
    article: CAPIArticle
    onTopPositionChange: OnTopPositionChangeFn
}) => {
    switch (article.type) {
        case 'article':
            return (
                <Article
                    onTopPositionChange={onTopPositionChange}
                    article={article}
                />
            )

        case 'picture':
            return (
                <Article
                    onTopPositionChange={onTopPositionChange}
                    article={article}
                    theme={ArticleTheme.Dark}
                />
            )

        case 'gallery':
            return (
                <ScrollView {...wireScrollBarToDismiss(onTopPositionChange)}>
                    <Gallery gallery={article} />
                </ScrollView>
            )

        case 'crossword':
            return <Crossword crosswordArticle={article} />

        default:
            return (
                <FlexErrorMessage
                    title={'Unable to render article'}
                    style={{ backgroundColor: color.background }}
                />
            )
    }
}

export { ArticleController }
