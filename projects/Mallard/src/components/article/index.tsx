import React from 'react'
import { CAPIArticle } from 'src/common'
import { FlexErrorMessage } from 'src/components/layout/ui/errors/flex-error-message'
import { color } from 'src/theme/color'
import { Article as OldArticle } from './types/article'
import { Article } from './types/article-new'
import { Crossword } from './types/crossword'
import { Gallery } from './types/gallery'
import { Cartoon } from './types/cartoon'

import { ScrollView } from 'react-native'
import {
    OnTopPositionChangeFn,
    wireScrollBarToDismiss,
} from 'src/screens/article/helpers'
import { useOtherSettingsValues } from 'src/hooks/use-settings'

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
        case 'picture':
            return (
                <Article
                    onTopPositionChange={onTopPositionChange}
                    article={article}
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
            const message: never = article
            return (
                <FlexErrorMessage
                    title={'Unable to render article'}
                    style={{ backgroundColor: color.background }}
                />
            )
    }
}

export { ArticleController }
