import React from 'react'
import { CAPIArticle } from 'src/common'
import { FlexErrorMessage } from 'src/components/layout/ui/errors/flex-error-message'
import { color } from 'src/theme/color'
import { Article } from './types/article'
import { Crossword } from './types/crossword'
import { Gallery } from './types/gallery'
import { Cartoon } from './types/cartoon'

import { ScrollView } from 'react-native'
import {
    OnTopPositionChangeFn,
    wireScrollBarToDismiss,
} from 'src/screens/article/helpers'

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
                    article={article.elements}
                    {...article}
                />
            )

        case 'gallery':
            return (
                <ScrollView {...wireScrollBarToDismiss(onTopPositionChange)}>
                    <Gallery gallery={article} />
                </ScrollView>
            )

        case 'picture':
            return (
                <ScrollView {...wireScrollBarToDismiss(onTopPositionChange)}>
                    <Cartoon article={article} />
                </ScrollView>
            )

        case 'crossword':
            return (
                <ScrollView>
                    <Crossword crosswordArticle={article} />
                </ScrollView>
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
